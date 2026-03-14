import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Portfolio, Service, Testimonial, Message } from '@/models';
import { requireAdmin } from '@/lib/adminGuard';

export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  await connectDB();
  const [portfolio, services, testimonials, messages] = await Promise.all([
    Portfolio.countDocuments(),
    Service.countDocuments(),
    Testimonial.countDocuments(),
    Message.countDocuments(),
  ]);
  return NextResponse.json({ portfolio, services, testimonials, messages });
}
