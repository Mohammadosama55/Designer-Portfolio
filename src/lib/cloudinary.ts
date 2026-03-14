import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  file: string, // base64 or file path
  folder: string = 'portfolio',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
) {
  try {
    console.log('Cloudinary config check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
      api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
    })

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not configured')
    }

    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: resourceType,
      transformation: resourceType === 'image' ? [
        { quality: 'auto', fetch_format: 'auto' },
      ] : undefined,
    })
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
      duration: result.duration,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// Helper functions for image and video uploads
export async function uploadImage(buffer: Buffer, folder: string) {
  const base64 = buffer.toString('base64')
  const dataUri = `data:image/png;base64,${base64}`
  const result = await uploadToCloudinary(dataUri, folder, 'image')
  return result
}

export async function uploadVideo(buffer: Buffer, folder: string) {
  const base64 = buffer.toString('base64')
  const dataUri = `data:video/mp4;base64,${base64}`
  const result = await uploadToCloudinary(dataUri, folder, 'video')
  // Add thumbnail URL for videos
  return {
    ...result,
    thumbnailUrl: cloudinary.url(result.publicId, {
      transformation: [{ width: 480, height: 270, crop: 'fill' }],
    }),
  }
}

export async function deleteMedia(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  return deleteFromCloudinary(publicId, resourceType)
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

export default cloudinary
