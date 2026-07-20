import { createClient } from '@supabase/supabase-js'

export const useSupabaseClient = () => {
  const config = useRuntimeConfig()

  return createClient(
    config.public.supabaseApiUrl,
    config.public.supabaseKey
  )
}