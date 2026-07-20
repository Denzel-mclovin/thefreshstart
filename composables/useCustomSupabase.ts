

import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export const useCustomSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const config = useRuntimeConfig()

  supabaseInstance = createClient(
    config.public.supabaseApiUrl,
    config.public.supabaseKey
  )

  return supabaseInstance
}