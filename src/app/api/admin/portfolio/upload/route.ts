import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Portfolio } from '@/models';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminGuard';

export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    await connectDB();
    const formData = await req.formData();

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const featured = formData.get('featured') === 'true';
    const published = formData.get('published') === 'true';
    const mediaType = formData.get('mediaType') as 'image' | 'video';

    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
    }

    console.log('Upload data:', { title, description, category, tags, featured, published, mediaType });
    console.log('File details:', { fileName: file.name, fileSize: file.size, fileType: file.type });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let mediaUrl = '';
    let cloudinaryPublicId = '';
    let thumbnailUrl = '';

    if (mediaType === 'video') {
      try {
        const result = await uploadVideo(buffer, 'portfolio/videos');
        mediaUrl = result.url;
        cloudinaryPublicId = result.publicId;
        thumbnailUrl = result.thumbnailUrl;
      } catch (uploadError) {
        console.error('Video upload failed:', uploadError);
        throw new Error('Video upload failed: ' + (uploadError instanceof Error ? uploadError.message : 'Unknown error'));
      }
    } else {
      try {
        const result = await uploadImage(buffer, 'portfolio/images');
        mediaUrl = result.url;
        cloudinaryPublicId = result.publicId;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        throw new Error('Image upload failed: ' + (uploadError instanceof Error ? uploadError.message : 'Unknown error'));
      }
    }

    console.log('Cloudinary results:', { mediaUrl, cloudinaryPublicId, thumbnailUrl });

    if (!mediaUrl) {
      throw new Error('Upload failed - no media URL returned from Cloudinary');
    }

    const portfolioData = {
      title: title || 'Untitled',
      description: description || '',
      category: category || 'General',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      featured,
      published,
      mediaType,
      mediaUrl: mediaUrl || '',
      cloudinaryPublicId: cloudinaryPublicId || `temp_${Date.now()}`,
      thumbnailUrl: thumbnailUrl || '',
      cloudinaryThumbnailId: thumbnailUrl ? thumbnailUrl.split('/').pop()?.split('.')[0] || '' : '',
    };
    
    console.log('Portfolio data to save:', portfolioData);

    const item = await Portfolio.create(portfolioData);

    return NextResponse.json({ item, success: true });
  } catch (error: any) {
    console.error('upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
