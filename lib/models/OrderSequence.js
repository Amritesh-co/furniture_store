import mongoose from 'mongoose'

const OrderSequenceSchema = new mongoose.Schema({
  dateKey: { type: String, required: true, unique: true },
  sequence: { type: Number, required: true, default: 0, min: 0 },
}, { timestamps: true })

export default mongoose.models.OrderSequence || mongoose.model('OrderSequence', OrderSequenceSchema)
