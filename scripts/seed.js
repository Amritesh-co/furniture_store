const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')
const { pathToFileURL } = require('url')

// Load env
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local')
  process.exit(1)
}

// Inline model definitions
const ProductSchema = new mongoose.Schema({
  name: String, price: Number, description: String,
  category: String, material: String, dimensions: String,
  images: [String], stock: Number, lowStockThreshold: { type: Number, default: 5 },
  status: { type: String, default: 'inStock' },
  isFeatured: { type: Boolean, default: false },
  sales: { type: Number, default: 0 },
}, { timestamps: true })

ProductSchema.pre('save', function (next) {
  if (this.stock === 0) this.status = 'outOfStock'
  else if (this.stock <= this.lowStockThreshold) this.status = 'lowStock'
  else this.status = 'inStock'
  next()
})

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: { type: String, default: 'user' }, phone: String,
}, { timestamps: true })

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, default: null },
  customerInfo: Object, products: Array,
  subtotal: Number, shipping: Number, total: Number,
  paymentMethod: String, status: { type: String, default: 'pending' },
}, { timestamps: true })

const Product = mongoose.model('Product', ProductSchema)
const User = mongoose.model('User', UserSchema)
const Order = mongoose.model('Order', OrderSchema)

let businessInfoPromise

async function getBusinessInfo() {
  if (!businessInfoPromise) {
    const configPath = pathToFileURL(path.join(__dirname, '../lib/businessConfig.js')).href
    businessInfoPromise = import(configPath).then((module) => module.BUSINESS_INFO)
  }

  return businessInfoPromise
}

// Sample data inline (avoids ESM import issues)
const sampleProducts = [
  { name: 'Royal Teak Sofa Set', price: 89999, description: 'Handcrafted 5-seater sofa set made from premium Rajasthani teak wood with plush cushions upholstered in rich fabric.', category: 'Sofas', material: 'Teak Wood', dimensions: '220x90x85cm', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'], stock: 8, lowStockThreshold: 3, isFeatured: true, sales: 24 },
  { name: 'Sheesham Dining Table', price: 45999, description: 'Solid sheesham wood 6-seater dining table with natural grain finish. Perfect centerpiece for Indian homes.', category: 'Tables', material: 'Sheesham Wood', dimensions: '180x90x76cm', images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'], stock: 12, lowStockThreshold: 4, isFeatured: true, sales: 18 },
  { name: 'Mango Wood King Bed', price: 67500, description: 'Luxurious king-size bed crafted from seasoned mango wood with carved headboard inspired by Mughal artistry.', category: 'Beds', material: 'Mango Wood', dimensions: '200x180x120cm', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'], stock: 5, lowStockThreshold: 3, isFeatured: true, sales: 15 },
  { name: 'Rattan Peacock Chair', price: 18999, description: 'Handwoven rattan peacock chair — an iconic statement piece blending Indian craft tradition and modern bohemian style.', category: 'Chairs', material: 'Rattan', dimensions: '80x70x140cm', images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80'], stock: 15, lowStockThreshold: 5, isFeatured: false, sales: 30 },
  { name: 'Carved Jali Bookshelf', price: 32999, description: 'Intricate jali lattice bookshelf in sheesham wood. Five spacious shelves to display books and décor.', category: 'Storage', material: 'Sheesham Wood', dimensions: '90x35x180cm', images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80'], stock: 7, lowStockThreshold: 3, isFeatured: false, sales: 12 },
  { name: 'Velvet Maharaja Armchair', price: 24999, description: 'Deep-buttoned velvet armchair with solid teak legs. Inspired by royal Indian aesthetics with modern comfort.', category: 'Chairs', material: 'Fabric', dimensions: '75x80x90cm', images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'], stock: 20, lowStockThreshold: 5, isFeatured: true, sales: 22 },
  { name: 'Marble Top Coffee Table', price: 27500, description: 'Italian marble top on a brass-finished stainless steel frame. A luxe addition to any living room.', category: 'Tables', material: 'Marble', dimensions: '110x60x45cm', images: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&q=80'], stock: 3, lowStockThreshold: 5, isFeatured: false, sales: 9 },
  { name: 'Teak TV Entertainment Unit', price: 38999, description: 'Modern TV unit in solid teak with cable management, open shelves, and soft-close drawers.', category: 'Storage', material: 'Teak Wood', dimensions: '160x40x55cm', images: ['https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&q=80'], stock: 10, lowStockThreshold: 4, isFeatured: false, sales: 14 },
  { name: 'Upholstered Queen Bed', price: 52999, description: 'Queen-size bed with premium fabric headboard and engineered wood frame. Includes under-bed storage.', category: 'Beds', material: 'Engineered Wood', dimensions: '200x160x110cm', images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'], stock: 0, lowStockThreshold: 3, isFeatured: false, sales: 8 },
  { name: 'Leather Office Chair', price: 15999, description: 'Ergonomic leather executive chair with lumbar support, adjustable height, and chrome base.', category: 'Chairs', material: 'Leather', dimensions: '65x65x120cm', images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80'], stock: 25, lowStockThreshold: 5, isFeatured: false, sales: 35 },
]

const sampleOrders = [
  { customerInfo: { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91-9123456789', address: '42, MG Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' }, products: [{ name: 'Royal Teak Sofa Set', price: 89999, quantity: 1 }], subtotal: 89999, shipping: 0, total: 89999, paymentMethod: 'Online', status: 'delivered' },
  { customerInfo: { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91-9123456789', address: '42, MG Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' }, products: [{ name: 'Rattan Peacock Chair', price: 18999, quantity: 2 }], subtotal: 37998, shipping: 999, total: 38997, paymentMethod: 'COD', status: 'shipped' },
  { customerInfo: { name: 'Rahul Patel', email: 'rahul@example.com', phone: '+91-9988776655', address: '15, Linking Road, Bandra', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' }, products: [{ name: 'Sheesham Dining Table', price: 45999, quantity: 1 }, { name: 'Velvet Maharaja Armchair', price: 24999, quantity: 2 }], subtotal: 95997, shipping: 0, total: 95997, paymentMethod: 'Online', status: 'processing' },
]

async function seed() {
  try {
    const businessInfo = await getBusinessInfo()

    const sampleUsers = [
      { name: 'Admin', email: businessInfo.email, password: 'admin123', role: 'admin', phone: businessInfo.phone },
      { name: 'Priya Sharma', email: 'priya@example.com', password: 'user123', role: 'user', phone: '+91-9123456789' },
      { name: 'Rahul Patel', email: 'rahul@example.com', password: 'user123', role: 'user', phone: '+91-9988776655' },
    ]

    console.log('🔌 Connecting to MongoDB Atlas...')
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
    console.log('✅ Connected!')

    await Product.deleteMany({})
    await User.deleteMany({})
    await Order.deleteMany({})
    console.log('🗑️  Cleared existing data')

    const createdProducts = []
    for (const p of sampleProducts) {
      const product = new Product(p)
      await product.save()
      createdProducts.push(product)
    }
    console.log(`📦 Seeded ${createdProducts.length} products`)

    const createdUsers = []
    for (const u of sampleUsers) {
      const hashed = await bcrypt.hash(u.password, 10)
      const user = new User({ ...u, password: hashed })
      await user.save()
      createdUsers.push(user)
    }
    console.log(`👤 Seeded ${createdUsers.length} users`)

    for (let i = 0; i < sampleOrders.length; i++) {
      const order = new Order({
        ...sampleOrders[i],
        userId: createdUsers[1]?._id || null,
        products: sampleOrders[i].products.map((p, idx) => ({
          ...p,
          productId: createdProducts[idx]?._id || createdProducts[0]._id,
        })),
      })
      await order.save()
    }
    console.log(`🛒 Seeded ${sampleOrders.length} orders`)

    console.log('\n✅ Database seeded successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`🔐 Admin Login: ${businessInfo.email} / admin123`)
    console.log('🌐 Start server: npm run dev')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error.message)
    process.exit(1)
  }
}

seed()
