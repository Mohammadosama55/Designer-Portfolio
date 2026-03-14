import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Portfolio from '@/models/Portfolio'

// Disable caching for this route - ensures new items appear immediately
export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const filter: Record<string, unknown> = { published: true }
    if (category && category !== 'all') filter.category = category

    const items = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 })
    
    // Convert Mongoose documents to plain objects for JSON serialization
    const plainItems = items.map(item => item.toObject())
    
    console.log(`[Portfolio API] Found ${plainItems.length} published items${category ? ` in category: ${category}` : ''}`)

    // Return with no-cache headers to ensure fresh data
    return NextResponse.json(plainItems, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('[Portfolio API] Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
