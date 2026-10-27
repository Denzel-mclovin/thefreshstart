import { closeLeadAndCreateClient } from "../../services/client-conversion.service";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    leadId,
    contractValue,
    cashCollected,
    paymentMethod,
    paymentStatus,
    assignedConsultant,
    clientGoal,
    clientKpi,
    closedBy,
  } = body;

  if (!leadId) {
    throw createError({
      statusCode: 400,
      statusMessage: "leadId is required",
    });
  }

  const host = getRequestHeader(event, "host") || "thefreshstart.com";
  const protocol = host.includes("localhost") ? "http" : "https";

  try {
    const result = await closeLeadAndCreateClient({
      leadId,
      contractValue,
      cashCollected,
      paymentMethod,
      paymentStatus,
      assignedConsultant,
      clientGoal,
      clientKpi,
      closedBy: closedBy || "closer",
      hostUrl: `${protocol}://${host}`,
    });

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    console.error("Failed to close lead:", err);
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || "Failed to close lead",
    });
  }
});
