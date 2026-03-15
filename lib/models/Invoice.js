import mongoose from 'mongoose'

const InvoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  invoiceDate: { type: Date, default: Date.now },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    quantity: Number,
    unitPrice: Number,
    subtotal: Number,
    warranty: {
      warrantyPeriod: String,
      guaranteePeriod: String,
    }
  }],
  pricing: {
    subtotal: Number,
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: Number,
  },
  paymentStatus: { type: String, default: 'Pending' },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema)
