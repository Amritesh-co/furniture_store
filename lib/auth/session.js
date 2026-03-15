import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { errorResponse } from '@/lib/api/response'

export async function getServerAuthSession() {
  return getServerSession(authOptions)
}

export async function requireUserSession() {
  const session = await getServerAuthSession()
  if (!session?.user) {
    return { session: null, response: errorResponse('Unauthorized', 401) }
  }
  return { session, response: null }
}

export async function requireAdminSession() {
  const { session, response } = await requireUserSession()
  if (response) return { session: null, response }

  if (session.user.role !== 'admin') {
    return { session: null, response: errorResponse('Unauthorized', 401) }
  }

  return { session, response: null }
}
