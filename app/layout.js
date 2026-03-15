import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Providers from '@/components/Providers'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata = {
  title: { default: 'Woodcraft — Premium Indian Furniture', template: '%s | Woodcraft' },
  description: 'Shop handcrafted premium furniture made in India. Sofas, beds, tables, chairs, storage and custom furniture.',
  keywords: 'furniture, Indian furniture, wooden furniture, custom furniture, sofa, bed, table, chair',
  openGraph: {
    title: 'Woodcraft — Premium Indian Furniture',
    description: 'Handcrafted premium furniture made in India.',
    type: 'website',
  },
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers session={session}>
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}
