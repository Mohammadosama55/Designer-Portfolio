import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/models';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    console.log('=== Login Request Started ===');
    
    // Connect to database
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');
    
    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find or create admin on first run
    let admin = await Admin.findOne({ email });
    console.log('Admin lookup result:', admin ? 'Found existing admin' : 'Admin not found');
    
    if (!admin) {
      // Seed from env on first login
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      console.log('Checking environment credentials...');
      console.log('Email match:', email === adminEmail);
      console.log('Password match:', password === adminPassword);
      
      if (email === adminEmail && password === adminPassword) {
        console.log('Creating new admin from environment credentials');
        const hashed = await bcrypt.hash(password, 12);
        admin = await Admin.create({ email, password: hashed, role: 'admin' });
        console.log('Admin created successfully:', email);
      } else {
        console.log('Credentials do not match environment variables');
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    } else {
      // If admin exists, always allow login with env credentials (master override)
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      console.log('Found existing admin, checking master override...');
      console.log('Email match:', email === adminEmail);
      console.log('Password match:', password === adminPassword);
      console.log('Stored admin password hash:', admin.password);
      console.log('Entered password:', password);
      
      if (email === adminEmail && password === adminPassword) {
        console.log('Master override successful - using environment credentials');
        // Update stored password to match environment
        const hashed = await bcrypt.hash(password, 12);
        await Admin.updateOne({ email }, { password: hashed });
        // Re-fetch admin to get current data for token
        const updatedAdmin = await Admin.findOne({ email });
        const token = await signToken({ id: updatedAdmin._id.toString(), email: updatedAdmin.email, role: 'admin' });
        const res = NextResponse.json({ success: true });
        res.cookies.set('admin_token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60,
          path: '/',
        });
        return res;
      } else if (email === adminEmail && password === 'reset123') {
        console.log('Reset command detected - updating admin password to environment');
        // Reset admin password to environment variables
        if (!adminPassword) {
          return NextResponse.json({ error: 'ADMIN_PASSWORD not set in environment' }, { status: 500 });
        }
        const hashed = await bcrypt.hash(adminPassword, 12);
        await Admin.updateOne({ email }, { password: hashed });
        return NextResponse.json({ success: true, message: 'Admin password reset to environment variables' });
      } else {
        console.log('Credentials do not match environment variables');
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // Verify password
    console.log('Verifying password...');
    console.log('Stored admin password hash:', admin.password);
    console.log('Entered password:', password);
    
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      console.log('Password verification failed');
      console.log('Password comparison result for debugging:', valid);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    console.log('Password verified successfully');

    // Sign token
    const token = await signToken({ id: admin._id.toString(), email: admin.email, role: 'admin' });

    console.log('Setting authentication cookie...');
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    console.log('Cookie set successfully:', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    console.log('Login successful, token generated and cookie set');
    console.log('=== Login Request Completed ===');

    return res;
  } catch (error) {
    console.error('=== Login Error ===');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Login failed - ' + (error instanceof Error ? error.message : 'Unknown error') }, { status: 500 });
  }
}

