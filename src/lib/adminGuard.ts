import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';

export function requireAdmin(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null; // no error
}
