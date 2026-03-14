import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Hero } from '@/models';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const hero = await Hero.findOne().lean();
  return NextResponse.json({ hero });
}

export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  try {
    await connectDB();
    const body = await req.json();
    const hero = await Hero.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json({ hero, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
