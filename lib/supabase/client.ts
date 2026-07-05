import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Module-level singleton — critical for session persistence.
// A new createBrowserClient() instance starts with no cookies, so if a fresh
// instance is created on every call the session that was just written after
// login is invisible to the next component that calls getUser(), causing an
// immediate redirect back to /account/login on every page load or refresh.
let client: SupabaseClient | null = null

export function createClient() {
  if (client) return client
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  return client
}
