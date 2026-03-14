import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Hero, About, Service, Testimonial, Portfolio, ContactInfo } from '@/models';

export async function GET() {
  try {
    await connectDB();

    const [hero, about, services, testimonials, portfolio, contactInfo] = await Promise.all([
      Hero.findOne().lean(),
      About.findOne().lean(),
      Service.find({ published: true }).sort({ order: 1 }).lean(),
      Testimonial.find({ approved: true }).lean(),
      Portfolio.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean(),
      ContactInfo.findOne().lean(),
    ]);

    return NextResponse.json({ hero, about, services, testimonials, portfolio, contactInfo });
  } catch (error) {
    console.error('site-data error:', error);
    return NextResponse.json({ error: 'Failed to load site data' }, { status: 500 });
  }
}
