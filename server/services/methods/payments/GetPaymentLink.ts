// import { stripe } from "../../../../utils/stripe";
import { prisma } from "../../../../prisma/prisma";
import { sendSubscriptionLink }  from '../../../utils/sendSubscriptionLink';

const statusMap = {
  unpaid: "PENDING",
  paid: "COMPLETED",
  no_payment_required: "COMPLETED",
  pending: "PENDING"
} as const;

async function GetPaymentLink(event: any) {

    try {

        const body = await readBody<{

            email: string,           
            priceId: string,
            discountSize: number,
            sellerEmail: string,  
            sellerName: string,
            sellerLastName: string,
            clientName: string

        }>(event);

        const { email, priceId, discountSize, sellerEmail, sellerName, sellerLastName, clientName } = body;

        if (!email || !priceId || discountSize === undefined || discountSize === null || !sellerEmail) {
            throw createError({ statusCode: 400, statusMessage: "Missing fields" });
        }

        let seller = await prisma.seller.findUnique({ where: { email: sellerEmail } });

        if (!seller) {
            seller = await prisma.seller.create({
                data: {
                name: sellerName,
                lastName: sellerLastName,
                email: sellerEmail
                }
            });
        }



        // let couponId: string | undefined;
        // if (discountSize > 0) {
        // const coupon = await stripe.coupons.create({
        //     amount_off: discountSize * 100,
        //     currency: "usd",
        //     duration: "once",
        // });
        // couponId = coupon.id;
        // }


        // const session = await stripe.checkout.sessions.create({
        //     mode: "subscription",
        //     customer_email: email,
        //     line_items: [
        //         {
        //             price: priceId,
        //             quantity: 1,
        //         },
        //     ],
        //     subscription_data: {
        //         metadata: {
        //             sellerEmail: sellerEmail
        //         }
        //     },
        //     discounts: couponId ? [{ coupon: couponId }] : [],
        //     success_url: "https://nuxt-mystic-vision.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
        //     cancel_url: "https://nuxt-mystic-vision.vercel.app/cancel",
        //     metadata: {
        //         sellerEmail: sellerEmail
        //     }
            
        // });

        // const sessionStatus = statusMap[session.payment_status as keyof typeof statusMap];

        // await prisma.checkoutSession.create({
        //     data: {
        //         stripeId: session.id,    
        //         clientEmail: email,
        //         amountTotal: session.amount_total ?? 0,
        //         status: sessionStatus, 
        //         seller: { connect: { id: seller.id } } 
        //     }
        // });

        // console.log(session, "session");

        // await sendSubscriptionLink(
        //     {
        //         to: email,
        //         subject: 'Subscribe to Mystic Vision',
        //         templateName: 'subscription-ntf',
        //         props: {
        //             clientName: clientName,
        //             subject: 'Subscribe to Mystic Vision',
        //             headerBanner: 'https://mystic-vis.vercel.app/images/email-banners/Header-template.webp',
        //             link: session.url
        //         }
        //     }
          
        // )

        // return {
        //     statusCode: 200,
        //     message: "Success",
        //     emailStatus: true,
        //     url: session.url
        // }

    } catch (err) {
        console.log(`Something went wrong: ${err}`)
        return {
            statusCode: 500,
            message: "Something went wrong",
            emailStatus: false,
            error: err
        }

    }
}

export default GetPaymentLink;