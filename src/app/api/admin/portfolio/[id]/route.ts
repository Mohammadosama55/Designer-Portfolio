import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Portfolio } from '@/models';
import { deleteMedia } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminGuard';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    await connectDB();
    const item = await Portfolio.findById(params.id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete from Cloudinary
    if (item.cloudinaryPublicId) {
      await deleteMedia(item.cloudinaryPublicId, item.mediaType);
    }

    await Portfolio.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    await connectDB();
    const body = await req.json();
    const item = await Portfolio.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
