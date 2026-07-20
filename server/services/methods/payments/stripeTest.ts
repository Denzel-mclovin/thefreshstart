// import { stripe } from "../../../../utils/stripe";



async function stripeTest() {

    try {

        // const getInfo = await stripe.products.list({
        //     limit: 3,
        // });

        // return {
        //     statusCode: 200,
        //     message: "Success",
        //     data: getInfo.data
        // }

    } catch (err) {
        console.log(`Error updating plan: ${err}`)
        return {
            statusCode: 500,
            message: "Error updating plan",
            error: err
        }
    }
}

export default stripeTest;