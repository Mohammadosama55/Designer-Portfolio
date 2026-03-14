import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Portfolio } from '@/models'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function GET() {
  await connectDB()
  const items = await Portfolio.find({}).sort({ order: 1, createdAt: -1 })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  console.log('[Portfolio POST] Received data:', body)
  console.log('[Portfolio POST] Published field:', body.published)
  const item = await Portfolio.create(body)
  console.log('[Portfolio POST] Saved item:', item)
  return NextResponse.json(item, { status: 201 })
}

export async function PUT(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const { _id, ...update } = body
  const item = await Portfolio.findByIdAndUpdate(_id, update, { new: true })
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  await connectDB()
  const { id } = await req.json()
  const item = await Portfolio.findById(id)
  if (item) {
    await deleteFromCloudinary(item.cloudinaryPublicId, item.mediaType)
    if (item.cloudinaryThumbnailId) await deleteFromCloudinary(item.cloudinaryThumbnailId)
    await item.deleteOne()
  }
  return NextResponse.json({ success: true })
}
