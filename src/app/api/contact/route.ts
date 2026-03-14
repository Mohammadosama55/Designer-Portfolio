import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Message from '@/models/Message'

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const { name, email, subject, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const msg = await Message.create({ name, email, subject: subject || 'No subject', message })
  return NextResponse.json({ success: true, id: msg._id })
}
