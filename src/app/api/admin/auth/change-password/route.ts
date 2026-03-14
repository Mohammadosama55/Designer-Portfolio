import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { currentPassword, newPassword } = await req.json();
    const admin = await Admin.findById(payload.id);
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return NextResponse.json({ error: 'Current password incorrect' }, { status: 400 });

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
