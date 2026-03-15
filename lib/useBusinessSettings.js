'use client'

import { useEffect, useState } from 'react'
import { BUSINESS_INFO } from '@/lib/businessConfig'

const DEFAULT_STATE = {
  businessInfo: BUSINESS_INFO,
  businessAddress: `${BUSINESS_INFO.addressLine1}, ${BUSINESS_INFO.addressLine2}`,
  businessMailto: `mailto:${BUSINESS_INFO.email}`,
  businessWhatsappUrl: `https://wa.me/${BUSINESS_INFO.whatsappNumber}`,
}

export function useBusinessSettings() {
  const [settings, setSettings] = useState(DEFAULT_STATE)

  useEffect(() => {
    let isMounted = true

    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' })
        const payload = await res.json()
        if (!res.ok || !payload?.data?.businessInfo || !isMounted) return

        const info = payload.data.businessInfo
        setSettings({
          businessInfo: info,
          businessAddress: `${info.addressLine1}, ${info.addressLine2}`,
          businessMailto: `mailto:${info.email}`,
          businessWhatsappUrl: `https://wa.me/${info.whatsappNumber}`,
        })
      } catch {
        // Keep static defaults on network/permission issues.
      }
    }

    loadSettings()
    return () => {
      isMounted = false
    }
  }, [])

  return settings
}
