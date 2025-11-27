// lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 클라이언트용 (RLS 적용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버용 (RLS 우회, 관리자 작업용)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// 타입 정의
export type ContactInquiry = {
  id?: string
  name: string
  contact: string
  org?: string
  message: string
  created_at?: string
}

export type Attachment = {
  id: string
  name: string
  url: string
  size: number
  type: string
}

export type Post = {
  id?: string
  title: string
  content: string
  author: string
  attachments?: Attachment[]
  created_at?: string
  updated_at?: string
}
