import mongoose from 'mongoose'

const CustomInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  furnitureType: {
    type: String,
    enum: ['Sofa', 'Bed', 'Table', 'Chair', 'Wardrobe', 'Other'],
    required: true,
  },
  budget: { type: Number },
  requirements: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
}, { timestamps: true })

export default mongoose.models.CustomInquiry || mongoose.model('CustomInquiry', CustomInquirySchema)
