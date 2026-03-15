import mongoose from 'mongoose'

const GlobalSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'global' },
  businessInfo: {
    brandName: String,
    displayName: String,
    legalName: String,
    email: String,
    phone: String,
    phoneDisplay: String,
    whatsappNumber: String,
    instagramUrl: String,
    instagramHandle: String,
    addressLine1: String,
    addressLine2: String,
    shortAddress: String,
  },
}, { timestamps: true })

export default mongoose.models.GlobalSettings || mongoose.model('GlobalSettings', GlobalSettingsSchema)
