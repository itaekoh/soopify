// app/api/insights/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('sn_posts')
      .select('id, title, excerpt, content, featured_image_url, published_date, category_id, slug, sn_categories(slug)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_date', { ascending: false })
      .limit(3)

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching featured insights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
