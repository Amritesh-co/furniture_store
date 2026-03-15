import mongoose from 'mongoose'

export function validateObjectId(id, label = 'id') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return `Invalid ${label}`
  }
  return null
}
