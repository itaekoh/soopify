// app/api/admin/insights/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// sn_posts 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('sn_posts')
      .select(`
        id,
        title,
        excerpt,
        featured_image_url,
        published_date,
        is_featured,
        status,
        slug,
        category_id,
        sn_categories(name, slug)
      `)
      .eq('status', 'published')
      .order('published_date', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// is_featured 토글
export async function PATCH(request: NextRequest) {
  try {
    const { postId, isFeatured } = await request.json()

    // featured 글 개수 확인 (최대 6개로 제한)
    if (isFeatured) {
      const { count } = await supabaseAdmin
        .from('sn_posts')
        .select('id', { count: 'exact', head: true })
        .eq('is_featured', true)

      if (count && count >= 6) {
        return NextResponse.json(
          { error: 'Featured 글은 최대 6개까지만 설정할 수 있습니다.' },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabaseAdmin
      .from('sn_posts')
      .update({ is_featured: isFeatured })
      .eq('id', postId)
      .select()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}
