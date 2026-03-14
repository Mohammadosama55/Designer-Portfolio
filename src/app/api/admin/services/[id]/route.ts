import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Service } from '@/models';
import { requireAdmin } from '@/lib/adminGuard';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const body = await req.json();
  const service = await Service.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json({ service });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  await Service.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
