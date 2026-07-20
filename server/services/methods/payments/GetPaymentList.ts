import { prisma } from "../../../../prisma/prisma";



async function GetPaymentList() {


    try {

        const getLinks = await prisma.payment.findMany({
            orderBy: {
                paidAt: 'desc'
            },
            include: {
                user: true
            }
        })

        return {
            statusCode: 200,
            message: "Success",
            data: getLinks  
        }

    } catch (err) {

        console.log(`Something went wrong ${err}`);

        return {
            statusCode: 500,
            message: `Something went wrong ${err}`,
            err: err
        }

    }
}



export default GetPaymentList;