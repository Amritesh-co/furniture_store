import connectDB from '@/lib/mongodb'
import GlobalSettings from '@/lib/models/GlobalSettings'
import { DEFAULT_BUSINESS_INFO, mergeBusinessInfo } from '@/lib/businessConfig'

const GLOBAL_SETTINGS_KEY = 'global'

export async function getBusinessInfo() {
  try {
    await connectDB()
    const settings = await GlobalSettings.findOne({ key: GLOBAL_SETTINGS_KEY }).lean()
    return mergeBusinessInfo(settings?.businessInfo || {})
  } catch {
    return DEFAULT_BUSINESS_INFO
  }
}

export async function updateBusinessInfo(nextBusinessInfo) {
  await connectDB()

  const merged = mergeBusinessInfo(nextBusinessInfo || {})

  await GlobalSettings.findOneAndUpdate(
    { key: GLOBAL_SETTINGS_KEY },
    {
      key: GLOBAL_SETTINGS_KEY,
      businessInfo: merged,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  return merged
}
