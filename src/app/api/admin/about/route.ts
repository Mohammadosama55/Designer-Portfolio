import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { About } from '@/models';
import { uploadImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const about = await About.findOne().lean();
  return NextResponse.json({ about });
}

export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const body = await req.json();
  const about = await About.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json({ about, success: true });
}
