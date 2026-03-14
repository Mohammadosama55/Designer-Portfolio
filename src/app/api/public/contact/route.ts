import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Message } from '@/models';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await Message.create({ name, email, subject, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('contact error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
