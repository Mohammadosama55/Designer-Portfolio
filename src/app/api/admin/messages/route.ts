import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const items = await Message.find({}).sort({ createdAt: -1 })
  return NextResponse.json(items)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  const item = await Message.findByIdAndUpdate(id, { read: true }, { new: true })
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await connectDB()
  const { id } = await req.json()
  await Message.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
