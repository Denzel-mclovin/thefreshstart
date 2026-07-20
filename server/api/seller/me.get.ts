import { prisma } from '../../../prisma/prisma'
import { useCustomSupabase } from '../../../composables/useCustomSupabase'

// export default defineEventHandler(async (event) => {
//   const authHeader = getHeader(event, 'authorization')

//   if (!authHeader) {
//     throw createError({
//       statusCode: 401,
//       statusMessage: 'Unauthorized'
//     })
//   }

//   const token = authHeader.replace('Bearer ', '')

//   const supabase = useCustomSupabase()

//   const {
//     data: { user },
//     error
//   } = await supabase.auth.getUser(token)

//   if (error || !user) {
//     throw createError({
//       statusCode: 401,
//       statusMessage: 'Invalid token'
//     })
//   }

//   const seller = await prisma.seller.findUnique({
//     where: {
//       authUserId: user.id
//     }
//   })

//   if (!seller) {
//     throw createError({
//       statusCode: 404,
//       statusMessage: 'Seller not found'
//     })
//   }

//   return seller
// })

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const token = authHeader.replace('Bearer ', '')

  const supabase = useCustomSupabase()

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  const seller = await prisma.seller.findUnique({
    where: {
      email: data.user.email
    }
  })

  if (!seller) {
    return null
  }

  return seller
})