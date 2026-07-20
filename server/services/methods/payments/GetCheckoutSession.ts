// import { stripe } from "../../../../utils/stripe";



async function GetCheckoutSession(sessionId: string) {


    try {

        if (!sessionId) {
            throw createError({ statusCode: 400, statusMessage: "Missing session id" });
        }

        // const session = await stripe.checkout.sessions.retrieve(sessionId, {
        //     expand: ["payment_intent"],
        // });

        // return session;

    } catch (err) {
        console.log(`Error during getting checkout session: ${err}`)

        return {
            statusCode: 500,
            message: "Error during getting checkout session",
            error: err
        }
    }

}


export default GetCheckoutSession;