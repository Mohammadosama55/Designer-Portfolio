import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/mongodb'
import SiteContent from '@/models/SiteContent'

async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'dev-secret-key-change-in-production-32chars-min')
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAuth(req)
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  await connectDB()
  const { searchParams } = new URL(req.url)
  const section = searchParams.get('section')
  if (section) {
    const item = await SiteContent.findOne({ section })
    return NextResponse.json(item?.data || {})
  }
  const all = await SiteContent.find({})
  return NextResponse.json(all)
}

export async function PUT(req: NextRequest) {
  const isAuthorized = await verifyAuth(req)
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  await connectDB()
  const { section, data } = await req.json()
  const item = await SiteContent.findOneAndUpdate(
    { section },
    { section, data },
    { upsert: true, new: true }
  )
  return NextResponse.json(item)
}
