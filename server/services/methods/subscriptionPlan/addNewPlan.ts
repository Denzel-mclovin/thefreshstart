import { readMultipartFormData } from "#imports";
import { prisma } from "../../../../prisma/prisma";




async function addNewPlan(data: any) {

    console.log(data, 'enter server component')


    // const formData = await readMultipartFormData(event);


    // if (!formData) {
    //     return {
    //         message: "No data received"
    //     }
    // }

    // const textField = formData.find((field: any) => field.name === "data");

    // if (!textField) {
    //     return {
    //         message: "No data received"
    //     }
    // }

    // const subscriptionPlanData = JSON.parse(textField.data.toString());

    try {

        const newPlan = await prisma.subscriptionPlan.create({
            data: data

            // data: {
            //     subName: subscriptionPlanData.planName,
            //     monthlyAmount: +subscriptionPlanData.monthlyAmount,
            //     yearlyAmount: +subscriptionPlanData.yearlyAmount,
            //     subDescription: subscriptionPlanData.description,
            //     paymentLink: subscriptionPlanData.paymentLink,
            //     subStatus: "active",
            // }
        })

        return {
            status: "success",
            data: newPlan
        }

    } catch (error) {
            console.error("Prisma subscriptionPlan.create error:", error);
        return {
            status: "error",
            error
        }
        
    }


}




export default addNewPlan;