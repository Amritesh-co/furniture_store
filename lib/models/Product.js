import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Sofas', 'Chairs', 'Tables', 'Beds', 'Storage'],
  },
  material: { type: String, required: true },
  dimensions: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: [0, 'Stock cannot be negative'] },
  lowStockThreshold: { type: Number, default: 5, min: [0, 'Low Stock Threshold cannot be negative'] },
  status: {
    type: String,
    enum: ['inStock', 'lowStock', 'outOfStock'],
    default: 'inStock',
  },
  isFeatured: { type: Boolean, default: false },
  sales: { type: Number, default: 0 },
  warranty: {
    warrantyPeriod: { type: String, default: '' },
    guaranteePeriod: { type: String, default: '' },
    termsAndConditions: [{ type: String }],
  },
}, { timestamps: true })

// Auto-update status based on stock
ProductSchema.pre('save', function () {
  if (this.stock === 0) {
    this.status = 'outOfStock'
  } else if (this.stock <= this.lowStockThreshold) {
    this.status = 'lowStock'
  } else {
    this.status = 'inStock'
  }
})

// Text index for optimized search
ProductSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text', 
  material: 'text' 
}, {
  weights: {
    name: 10,
    category: 5,
    material: 3,
    description: 1
  },
  name: 'ProductTextIndex'
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
