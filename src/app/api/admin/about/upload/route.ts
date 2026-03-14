import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { About } from '@/models';
import { uploadImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminGuard';

export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadImage(buffer, 'portfolio/about');
    await About.findOneAndUpdate({}, { imageUrl: url, imagePublicId: publicId }, { upsert: true });
    return NextResponse.json({ url, publicId, success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
