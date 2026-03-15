import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
