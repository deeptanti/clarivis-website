import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

export function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error('Missing Supabase environment variables')
    supabaseInstance = createClient(url, key)
  }
  return supabaseInstance
}

export function getSupabaseAdmin() {
  if (!supabaseAdminInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Missing Supabase admin environment variables')
    supabaseAdminInstance = createClient(url, key)
  }
  return supabaseAdminInstance
}

export const supabase = {
  from: (table: string) => getSupabase().from(table),
  auth: { getUser: () => getSupabase().auth.getUser() }
}

export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table)
}
