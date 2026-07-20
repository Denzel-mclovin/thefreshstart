import { prisma } from "../../../../prisma/prisma";





async function removePlan(id: string) {

    try {
        
    const deletedPlan = await prisma.subscriptionPlan.delete({
      where: { id },
    });
    return {
        statusCode: 200,
        deletedPlan
    }
  } catch (error) {
    console.error("Error deleting plan:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete subscription plan",
    });
  }


}



export default removePlan;