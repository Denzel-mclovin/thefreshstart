import { prisma } from "../../../../prisma/prisma";
import { readMultipartFormData } from "#imports";


async function discountStatusUpdate(event: any) {


    const formData = await readMultipartFormData(event);

    if (!formData) {
        return {
            message: "No data received"
        }
    }


    const textField = formData.find((field: any) => field.name === "data");

    if (!textField) {
        return {
            message: "No data received"
        }
    }

    const parsedData = JSON.parse(textField.data.toString());
    const reservationId = parsedData.reservationId;


    if (!reservationId) {
        return { message: "Invalid reservationId" };
    }

  try {
  const updated = await prisma.callback.update({
    where: { id: reservationId }, 
    data: { status: "PURCHASED" }
  });

  return { message: "Discount status updated", updated };
} catch (error) {
  console.log(error, 'error');
  return { message: "Something went wrong" };
}

}



export default discountStatusUpdate;




