import mongoose from 'mongoose'

const ShopDaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  open: {
    type: Boolean,
    required: true
  }
}, { timestamps: true })

export default mongoose.models.ShopDay || mongoose.model('ShopDay', ShopDaySchema)
