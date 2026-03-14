import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'

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
  const items = await Testimonial.find({}).sort({ createdAt: -1 })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyAuth(req)
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  await connectDB()
  const body = await req.json()
  const item = await Testimonial.create({ ...body, approved: true })
  return NextResponse.json(item, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const isAuthorized = await verifyAuth(req)
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  await connectDB()
  const body = await req.json()
  const { _id, ...update } = body
  const item = await Testimonial.findByIdAndUpdate(_id, update, { new: true })
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  const isAuthorized = await verifyAuth(req)
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  await connectDB()
  const { id } = await req.json()
  await Testimonial.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
