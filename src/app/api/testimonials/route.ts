import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Testimonial from '@/models/Testimonial'

export async function GET() {
  await connectDB()
  const items = await Testimonial.find({ approved: true }).sort({ createdAt: -1 })
  return NextResponse.json(items)
}
