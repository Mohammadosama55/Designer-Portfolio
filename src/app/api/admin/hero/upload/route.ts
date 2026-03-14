import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Hero } from '@/models';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminGuard';

export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'showreel' | 'photo'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    let url = '';
    let publicId = '';

    if (type === 'showreel') {
      const result = await uploadVideo(buffer, 'portfolio/hero');
      url = result.url;
      publicId = result.publicId;
      await Hero.findOneAndUpdate({}, { showreel: url, showreelPublicId: publicId }, { upsert: true });
    } else {
      const result = await uploadImage(buffer, 'portfolio/hero');
      url = result.url;
      publicId = result.publicId;
      await Hero.findOneAndUpdate({}, { profileImageUrl: url, profileImagePublicId: publicId }, { upsert: true });
    }

    return NextResponse.json({ url, publicId, success: true });
  } catch (error: any) {
    console.error('hero upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
