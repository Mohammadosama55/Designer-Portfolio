import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'dev-secret-key-change-in-production-32chars-min'
const secretKey = new TextEncoder().encode(secret)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          await connectDB()
          const admin = await Admin.findOne({ email: credentials.email })
          if (!admin) return null
          const isValid = await bcrypt.compare(credentials.password, admin.password)
          if (!isValid) return null
          return { id: admin._id.toString(), email: admin.email, role: 'admin' }
        } catch {
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as { role?: string }).role = (user as unknown as { role: string }).role
      return token
    },
    async session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret,
}

export async function signToken(payload: JWTPayload): Promise<string> {
  console.log('Signing token with jose...')
  console.log('Token payload:', payload)
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
    
  console.log('Token signed successfully:', token.substring(0, 50) + '...')
  return token
}

export async function verifyToken(token: string): Promise<{ id: string; email: string; role: string } | null> {
  try {
    console.log('Verifying token with jose...')
    const { payload } = await jwtVerify(token, secretKey)
    console.log('Token verified successfully:', payload)
    return payload as { id: string; email: string; role: string }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const cookie = req.cookies.get('admin_token')
  if (cookie) return cookie.value
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7)
  return null
}

export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  const token = getTokenFromRequest(req)
  if (!token) return false
  const payload = await verifyToken(token)
  return payload?.role === 'admin'
}

// Legacy functions for backward compatibility
export function signTokenSync(payload: object): string {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyTokenSync(token: string): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, secret) as { id: string; email: string; role: string }
  } catch {
    return null
  }
}
