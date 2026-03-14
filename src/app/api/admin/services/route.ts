import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Service } from '@/models';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const services = await Service.find().sort({ order: 1 }).lean();
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const body = await req.json();
  const service = await Service.create(body);
  return NextResponse.json({ service, success: true });
}
