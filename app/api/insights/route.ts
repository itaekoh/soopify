// app/api/insights/route.ts
import { NextResponse } from 'next/server'
import { getFeaturedInsights } from '@/lib/insights'

export async function GET() {
  try {
    const data = await getFeaturedInsights(3)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching featured insights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
