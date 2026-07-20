

import { prisma } from "../../../prisma/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const {
      authUserId,
      email,
      firstName,
      lastName
    } = body;

    if (!authUserId || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: "authUserId and email are required"
      });
    }

    const existingSeller = await prisma.seller.findUnique({
      where: {
        authUserId
      }
    });

    if (existingSeller) {
      return {
        success: true,
        seller: existingSeller
      };
    }

    const seller = await prisma.seller.create({
      data: {
        authUserId,
        email,
        name: firstName,
        lastName
      }
    });

    return {
      success: true,
      seller
    };
  } catch (error) {
    console.error("Seller registration error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create seller"
    });
  }
});
