import { prisma } from "../../../../prisma/prisma";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";



async function webhookHandler(event: any) {

    const body = await readBody(event);

    try {

        const checkReceivedEmail = await prisma.user.findUnique({
            where: {
                skoolUserEmail: body.email
            }
        });

        if (!checkReceivedEmail) {
            return {
                message: "User not found"
            }
        }

        const bookVariantId = checkReceivedEmail.selectedVarId;
        const userName = checkReceivedEmail.name;

        const discountCode = `BOOK50-${Date.now()}`;
        const variantGID = `gid://shopify/ProductVariant/${bookVariantId}`;
        
            const query = `
              mutation {
                discountCodeBasicCreate(basicCodeDiscount: {
                  title: "50% Book Discount",
                  code: "${discountCode}",
                  startsAt: "${new Date().toISOString()}",
                  customerSelection: {
                    all: true
                },
                  customerGets: {
                    value: { percentage: 0.5 }
                    items: { products: { productVariantsToAdd: ["${variantGID}"] } }
                  }
                }) {
                  userErrors {
                    field
                    message
                  }
                  codeDiscountNode {
                    id
                  }
                }
              }
            `
        
            const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/graphql.json`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
              },
              body: JSON.stringify({ query }),
            })
        
            const shopifyData = await response.json()
        
            if (shopifyData.data.discountCodeBasicCreate.userErrors.length > 0) {
              return {
                success: false,
                errors: shopifyData.data.discountCodeBasicCreate.userErrors,
              }
            }
        
            // const variantId = "49305684803752"
            const discountLink = `https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${bookVariantId}:1?discount=${discountCode}`
        
            const transporter = nodemailer.createTransport({
              host: process.env.ZOHO_APP_HOST || "smtp.zoho.eu",
              port: 465,
              secure: true,
              auth: {
                user: process.env.ZOHO_NO_REPLY_USER,
                pass: process.env.ZOHO_APP_PASSWORD,
              },
               tls: {
        
                    rejectUnauthorized: true,
                }
            });

            await prisma.user.update({
                where: {
                    skoolUserEmail: body.email
                },
                data: {
                    skoolSubscription: true,
                    isBookDiscount: false,
                    skoolUserId: body.skool_id,
                }
            })
        
            const sendEmail = await transporter.sendMail({
                from: `"Mystic Visions" <${process.env.ZOHO_NO_REPLY_USER}>`,
                to: body.email,
                subject: 'Shopify discount link',
                text: `Hello ${userName}! <br>, here is your discount link ${discountLink}. <br> Hurry up, the link is available for 24 hours.`,
        
            })
        
            console.log("Email sent:", sendEmail)
        
            return {
              success: true,
              discountCode,
              discountLink,
              sendEmail
            }




        // const discountCode = `BOOK-${Date.now()}`;
        // const query = `
        //     mutation {
        //         discountCodeBasicCreate(basicCodeDiscount: {
        //             title: "50% Book Discount", 
        //             code: "${discountCode}",
        //             startsAt: "${new Date().toISOString()}",
        //             endsAt: "${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}",
        //             usageLimit: 1,
        //             appliesOncePerCustomer: true,
        //             customerGets: {
        //                 value: { percentage: 50 }
        //                 items: { all: true }

        //             }
        //         }) {
        //             userErrors {
        //                 field
        //                 message
        //             }
        //             codeDiscountNode {
        //                 id
        //             }

        //         }
        //     }
        // `
        // ;

        // const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN!,
        //     },
        //     body: JSON.stringify({ query }),
        // });

        // const shopifyData = await response.json();

        // if (shopifyData.data.discountCodeBasicCreate.userErrors.length > 0) {
        //     return { success: false, message: 'Shopify error', errors: shopifyData.data.discountCodeBasicCreate.userErrors }
        // }

        // const discountUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/discount/${discountCode}?redirect=/products/book`


        // await prisma.user.update({
        //     where: {
        //         skoolUserEmail: body.email
        //     },
        //     data: {
        //         skoolUserId: body.skool_id,
        //         skoolUserName: body.user_name,
        //         skoolUserLastName: body.user_last_name,
        //         skoolSubDate: body.date,
        //         skoolSubscription: true,
        //     }
        // });


        // const transporter = nodemailer.createTransport({
        //     host: process.env.SMTP_HOST!,
        //     port: process.env.SMTP_PORT,
        //     secure: true,
        //     auth: {
        //         user: process.env.EMAIL,
        //         pass: process.env.PASSWORD,
        //     },
        // } as SMTPTransport.Options);

        // await transporter.sendMail({
        //     from: 'no-reply@thepillarswisdom.com',
        //     to: body.email,
        //     subject: 'Your 50% Book Discount',
        //     html: `<p>Hello,</p>
        //    <p>Here is your unique <strong>50% discount link</strong> for our book:</p>
        //    <p><a href="${discountUrl}" target="_blank">${discountUrl}</a></p>
        //    <p>Hurry! Offer is valid for 24 hours.</p>`,
        // })


        // return { 
        //     success: true,
        //     discountUrl
        // }

    }

    catch (error) {
        console.error("Error in webhookHandler:", error);
        return {
            message: "Error in webhookHandler",
            error: error
        }
    }




}


export default webhookHandler;