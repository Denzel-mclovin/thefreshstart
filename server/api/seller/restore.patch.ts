import { prisma } from "../../../prisma/prisma";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const { sellerId } = body;


  try {

    const checkSeller = await prisma.seller.findUnique({
      where: {
        id: sellerId
      }
    })

    if (!checkSeller) {
      return {
        statusCode: 400,
        message: "Seller not found"
      }
    }

    await prisma.seller.update({
      where: {
        id: sellerId
      },
      data: {
        approved: "APPROVED"
      }
    })

    return {
      statusCode: 200,
      message: "Seller rejected",
    }

  } catch (err) {

    console.log(`Error updating seller data: ${err}`)
    return {
      statusCode: 500,
      message: "Error updating seller data",
      error: err
    }

  }
})