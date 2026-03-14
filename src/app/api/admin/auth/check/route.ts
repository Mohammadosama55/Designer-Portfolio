import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  
  if (!token) {
    return NextResponse.json({ 
      authenticated: false, 
      message: 'No token found' 
    });
  }
  
  try {
    const { verifyToken } = await import('@/lib/auth');
    const payload = await verifyToken(token);
    
    if (payload) {
      return NextResponse.json({ 
        authenticated: true, 
        user: {
          email: payload.email,
          role: payload.role,
        }
      });
    } else {
      return NextResponse.json({ 
        authenticated: false, 
        message: 'Invalid token' 
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false, 
      message: 'Token verification failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
