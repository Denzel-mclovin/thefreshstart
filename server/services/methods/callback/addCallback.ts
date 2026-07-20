import { readMultipartFormData } from "#imports";
import { prisma } from "../../../../prisma/prisma";


async function addCallback(event: any) {

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

    const productData = JSON.parse(textField.data.toString());


    try{

        const user = await prisma.user.findUnique({
            where: {
                email: productData.email
            }
        })

        if (!user) {
            await prisma.user.create({
                data: {
                    email: productData.email,
                    name: productData.name
                }
            })
        }


        const callback = await prisma.callback.create({
            data: {
                name: productData.name,
                email: productData.email,
                phone: productData.phone,
                contactMethod: productData.contactMethod,
                timeZone: productData.timeZone,
                country: productData.country,
                language: productData.language,
                timeSlot: productData.timeSlot,
                dateCallback: productData.dateCallback,
                comment: productData.comment,
                discountEndAt: productData.discountEndAt,
                status: productData.status

            }
        })

        return {
            status: "success",
            data: callback
        }

    } catch(error) {
           console.error(error, "DB error in addCallback")
        return {
            message: `${error} Something went wrong`
        }
    }
}

export default addCallback;