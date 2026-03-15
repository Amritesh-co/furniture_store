import mongoose from 'mongoose'

const InventoryLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String },
  changeType: {
    type: String,
    enum: ['increase', 'decrease', 'manual_adjustment'],
    required: true,
  },
  quantityChanged: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  reason: {
    type: String,
    enum: ['order', 'restock', 'admin_edit'],
    required: true,
  },
}, { timestamps: true })

export default mongoose.models.InventoryLog || mongoose.model('InventoryLog', InventoryLogSchema)
