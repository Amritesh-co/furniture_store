export const DEFAULT_BUSINESS_INFO = {
  brandName: 'WOODCRAFT',
  displayName: 'Woodcraft Furniture',
  legalName: 'WOODCRAFT INDIA PVT. LTD.',
  email: 'woodcraft.rnc@gmail.com',
  phone: '6201687062',
  phoneDisplay: '+91 62016 87062',
  whatsappNumber: '916201687062',
  instagramUrl: 'https://www.instagram.com/woodcraftranchi',
  instagramHandle: '@woodcraftranchi',
  addressLine1: 'Sahu Complex, Near Panchwati Plaza',
  addressLine2: 'Kutchery Rd, Ranchi, Jharkhand 834001',
  shortAddress: 'Sahu Complex, Kutchery Rd, Ranchi, JH 834001',
}

export function mergeBusinessInfo(partial = {}) {
  const merged = {
    ...DEFAULT_BUSINESS_INFO,
    ...partial,
  }

  if (!merged.phoneDisplay) {
    merged.phoneDisplay = merged.phone
  }

  if (!merged.shortAddress) {
    merged.shortAddress = `${merged.addressLine1}, ${merged.addressLine2}`
  }

  if (!merged.whatsappNumber) {
    merged.whatsappNumber = String(merged.phone || '').replace(/\D/g, '')
  }

  return merged
}

// Backward-compatible static exports used as fallbacks.
export const BUSINESS_INFO = mergeBusinessInfo()
export const BUSINESS_ADDRESS = `${BUSINESS_INFO.addressLine1}, ${BUSINESS_INFO.addressLine2}`
export const BUSINESS_MAILTO = `mailto:${BUSINESS_INFO.email}`
export const BUSINESS_WHATSAPP_URL = `https://wa.me/${BUSINESS_INFO.whatsappNumber}`
