import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ContactInfo } from '@/models';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const info = await ContactInfo.findOne().lean();
  return NextResponse.json({ contactInfo: info });
}

export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const body = await req.json();
  const info = await ContactInfo.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json({ contactInfo: info, success: true });
}
