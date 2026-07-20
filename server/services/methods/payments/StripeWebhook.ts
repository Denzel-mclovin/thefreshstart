import Stripe from "stripe";
import { prisma } from "../../../../prisma/prisma";
// import { stripe } from "../../../../utils/stripe";




async function StripeWebhook(event: any) {


    const sig = getHeader(event, "stripe-signature");

    if (!sig) {
        throw createError({ statusCode: 400, statusMessage: "Missing Stripe signature" });
    }

    const rawBody = await readRawBody(event);

    let stripeEvent: Stripe.Event;


    // try {
    //     stripeEvent = stripe.webhooks.constructEvent(
    //         rawBody!,
    //         sig,
    //         process.env.STRIPE_WEBHOOK_SECRET as string
    //     );
    // } catch (err) {
    //     console.error(" Webhook signature verification failed:", err);
    //     throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${err}` });
    // }

    try {

//          switch(stripeEvent.type) {
            
//             case "checkout.session.completed": {

//                 const session = stripeEvent.data.object as Stripe.Checkout.Session;

//                 console.log(session, 'session');

//                 const email = session.customer_details?.email;
//                 const customerId = session.customer as string;
//                 const subscriptionId = session.subscription as string;

//                 if (!email) throw new Error("Email is required");

               

//                 let user = await prisma.user.upsert({
//                     where: { email},
//                     update: { stripeCustomerId: customerId },
//                     create: { 
//                         email,
//                         name: email.split("@")[0],
//                         stripeCustomerId: customerId
//                      },
//                 });

//                 const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
//                 const subscriptionItem = stripeSub.items.data[0];

//                 await prisma.subscription.upsert({
//                     where: { stripeId: stripeSub.id },
//                     update: {
//                         status: stripeSub.status as any,
//                         currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
//                     },
//                     create: {
//                         stripeId: stripeSub.id,
//                         userId: user.id,
//                         email: email,
//                         status: stripeSub.status as any,
//                         startDate: new Date(stripeSub.start_date * 1000),
//                         currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
//                         createdAt: new Date(stripeSub.created * 1000),
//                         updatedAt: new Date(),


//                     },
//                 });

//                 break;
                
//             }

//             case "customer.subscription.created": {
//                 const subscription = stripeEvent.data.object as Stripe.Subscription;
//                 const subscriptionItem = subscription.items.data[0];


//                 const customerId = subscription.customer as string;

//                 let user = await prisma.user.findFirst({
//                 where: { stripeCustomerId: customerId },
//                 });

//                 if (!user) {

//                     const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
//                     const email = customer.email ?? `default${Date.now()}@example.com`;
//                     const name = customer.name ?? email.split("@")[0];

//                     user = await prisma.user.create({
//                         data: {
//                             email,
//                             name,
//                             stripeCustomerId: customerId,
//                             createdAt: new Date(),
//                             updatedAt: new Date(),

//                         },
//                     });





//                 console.warn("⚠️ New customer created", subscription.id);
//                 break;
//                 }

//                 await prisma.subscription.upsert({
//                 where: { stripeId: subscription.id },
//                 update: {
//                     status: subscription.status as any,
//                     currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
//                     updatedAt: new Date(),
//                 },
//                 create: {
//                     stripeId: subscription.id,
//                     userId: user.id,
//                     email: user.email,
//                     status: subscription.status as any,
//                     startDate: new Date(subscription.start_date * 1000),
//                     currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                 },
//                 });

//                 break;
//             }

//             case "customer.subscription.updated": {
//                 const subscription = stripeEvent.data.object as Stripe.Subscription;
//                 const subscriptionItem = subscription.items.data[0];


//                 await prisma.subscription.update({
//                 where: { stripeId: subscription.id },
//                 data: {
//                     status: subscription.status as any,
//                     currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
//                     updatedAt: new Date(),
//                 },
//                 });

//                 break;
//             }

//             case "customer.subscription.deleted": {
//                 const subscription = stripeEvent.data.object as Stripe.Subscription;

//                 await prisma.subscription.update({
//                 where: { stripeId: subscription.id },
//                 data: {
//                     status: "canceled",
//                     updatedAt: new Date(),
//                 },
//                 });

//                 break;
//             }

// case "invoice.payment_succeeded": {
//     const invoice = stripeEvent.data.object as Stripe.Invoice & {
//         payment_intent?: string;
//         subscription?: string;
//         customer?: string;
//     };



//     const subscriptionId = invoice.subscription ?? null;
//     const customerId = invoice.customer ?? null;
//     let sellerEmail = invoice.metadata?.sellerEmail;

//            console.log("Webhook event type:", stripeEvent.type);
// console.log("Seller email from checkout session:", sellerEmail);


//     console.log(sellerEmail, invoice.metadata, "metadata dasd");

//      if (!sellerEmail && subscriptionId) {
//         const sessions = await stripe.checkout.sessions.list({
//             subscription: subscriptionId,
//             limit: 1,
//         });
//         const session = sessions.data[0];
//         sellerEmail = session?.metadata?.sellerEmail;
//         console.log("Seller email from checkout session:", sellerEmail);
//     }


//     if (!sellerEmail) {
//         console.warn(" invoice.payment_succeeded without seller", invoice.id);
//         break;
//     }

//     const seller = await prisma.seller.findUnique({
//         where: { email: sellerEmail },
//     });

//     if (!seller) {
//         console.warn("seller not found", invoice.id);
//         break;
//     }

//     let user = null;

//     if (customerId) {

//         user = await prisma.user.findFirst({
//             where: { stripeCustomerId: customerId },
//         });


//         if (!user) {
//             const customer = await stripe.customers.retrieve(customerId);

//              const email =
//         (customer as Stripe.Customer).email ??
//         invoice.customer_email ??
//         `${customerId}@no-email.stripe.local`;

//             if (!email) {
//                 console.warn("⚠️ Нет email у customer", customerId);
//                 break;
//             }

//             user = await prisma.user.upsert({
//                 where: { email },
//                 update: { stripeCustomerId: customerId },
//                 create: {
//                     email,
//                     name: email.split("@")[0],
//                     stripeCustomerId: customerId,
//                     sellerId: seller.id
//                 },
//             });
//         }
//     }

//     if (!user) {
//         console.warn(" invoice.payment_succeeded without user", invoice.id);
//         break;
//     }

   

//     let subscription = null;
 
//     if (subscriptionId) {
//         const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
//         const subscriptionItem = stripeSub.items.data[0];

//         subscription = await prisma.subscription.upsert({
//             where: { stripeId: stripeSub.id },
//             update: {
//             status: stripeSub.status as any,
//             currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
//             updatedAt: new Date(),
//             },
//             create: {
//             stripeId: stripeSub.id,
//             userId: user.id,
//             email: user.email,
//             status: stripeSub.status as any,
//             startDate: new Date(stripeSub.start_date * 1000),
//             currentPeriodEnd: new Date(subscriptionItem.current_period_end * 1000),
//             createdAt: new Date(stripeSub.created * 1000),
//             updatedAt: new Date(),
//             },
//         });
//         }

//     const paymentId = invoice.payment_intent ?? invoice.id as string;

//     await prisma.payment.upsert({
//         where: { stripeId: paymentId },
//         update: { status: "succeeded" },
//         create: {
//             stripeId: paymentId,
//             userId: user.id,
//             subscriptionId: subscription?.id ?? null,
//             amount: invoice.amount_paid,
//             currency: invoice.currency,
//             status: "succeeded",
//             paidAt: new Date(
//                 (invoice.status_transitions.paid_at ?? invoice.created) * 1000
//             ),
//         },
//     });

//     const sessionList = await stripe.checkout.sessions.list({
//         payment_intent: paymentId,
//         limit: 1,
//     });

//     const checkoutSession = sessionList.data[0];

//     if (checkoutSession) {
//         await prisma.checkoutSession.update({
//             where: { stripeId: checkoutSession.id },
//             data: {
//             status: "COMPLETED",
//             userId: user.id,
//             sellerId: seller.id,
//             amountTotal: invoice.amount_paid,
//         },
//     });
//     } else {
//         console.warn(" CheckoutSession not found for payment:", paymentId);
//     }

//     break;
// }

//             case "invoice.payment_failed": {


//                 const invoice = stripeEvent.data.object as Stripe.Invoice & {
//                     payment_intent?: string;
//                     subscription?: string;
//                     customer?: string;
//                 };

//                 const subscriptionId = invoice.subscription ?? null;
//                 const customerId = invoice.customer ?? null;
//                 const paymentId = (invoice.payment_intent as string) || invoice.id;

//                 if (!customerId || !paymentId) {
//                     console.warn("Missing customerId or paymentId in failed invoice", invoice.id);
//                 break;
//     }

//                 let user = await prisma.user.findFirst({
//                     where: { stripeCustomerId: customerId },
//                 });
//                 if (!user) {
//                     console.warn("User not found, creating temporary record", customerId);
//                     user = await prisma.user.create({
//                         data: {
//                             email: invoice.customer_email ?? `unknown-${customerId}@test.com`,
//                             name: invoice.customer_email?.split('@')[0] ?? "Unknown",
//                             stripeCustomerId: customerId,
//                         },
//                     });
//                 }

//                 const subscription = subscriptionId
//                 ? await prisma.subscription.findFirst({
//                     where: { stripeId: subscriptionId },
//                 })
//                 : null;


//                 await prisma.payment.upsert({
//                     where: { stripeId: paymentId },
//                     update: { status: "failed" },
//                     create: {
//                     stripeId: paymentId,
//                     userId: user.id,
//                     subscriptionId: subscription?.id ?? null,
//                     amount: invoice.amount_due, 
//                     currency: invoice.currency,
//                     status: "failed",
//                     paidAt: new Date(invoice.created * 1000),
//                     },
//                 });

//                 console.warn(`Payment failed for invoice ${invoice.id}`, invoice);
//                 break;
//             }

//         }


    } catch (err) {

        console.error("Webhook error:", err);
        throw createError({ statusCode: 500, statusMessage: "Internal webhook error" });

    }

    return { received: true };

}


export default StripeWebhook;