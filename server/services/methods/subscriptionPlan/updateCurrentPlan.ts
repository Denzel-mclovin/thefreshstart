import { prisma } from "../../../../prisma/prisma";
import { UpdatePlanData } from "~/types/subscriptionPlan";


async function updateCurrentPlan(id: string, data: UpdatePlanData) {

    try {


    const updatePlan = await prisma.subscriptionPlan.update({
      where: { id },
      data,
    });


    return {
        statusCode: 200,
        updatePlan
    }
  } catch (error) {
    console.error("Error updating plan:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update subscription plan",
    });
  }

}


export default updateCurrentPlan;