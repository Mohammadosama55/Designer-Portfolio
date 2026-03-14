import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { uploadToCloudinary } from '@/lib/cloudinary'

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

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyAuth(req)
  if (!isAuthorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.formData()
    const file = data.get('file') as File
    const folder = (data.get('folder') as string) || 'portfolio'
    const resourceType = (data.get('resourceType') as 'image' | 'video') || 'image'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    console.log('Upload request:', { folder, resourceType, fileName: file.name, fileSize: file.size })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    console.log('Uploading to Cloudinary...')
    const result = await uploadToCloudinary(base64, folder, resourceType)
    console.log('Upload successful:', result)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: errorMessage,
      hint: 'Check Cloudinary credentials in .env file'
    }, { status: 500 })
  }
}
