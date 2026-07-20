import { readBody, createError } from 'h3'
import { prisma } from '../../../prisma/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { inviteeUri, eventUri, sessionId } = body

  if (!inviteeUri) {
    throw createError({
      statusCode: 400,
      statusMessage: 'inviteeUri is required',
    })
  }

  const token = process.env.CALENDLY_TOKEN

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Calendly token is missing',
    })
  }

  try {
    const invitee = await $fetch<any>(inviteeUri, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('Invitee:', invitee)

    if (!invitee) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch Calendly invitee',
      })
    }

    const name = invitee.resource.name.trim()

    const parts = name.split(/\s+/)

    const receivedName = parts.shift() || ''
    const receivedLastName = parts.join(' ')

    

    await prisma.lead.update({
      where: {
        sessionId: sessionId
      },
      data: {
        firstName: receivedName,
        lastName: receivedLastName,
        email: invitee.resource.email,
      }
    })
    

    return {
      success: true,
      invitee: invitee,
    }
  } catch (error: any) {
    console.error(error)

    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'Failed to fetch Calendly invitee',
    })
  }
})