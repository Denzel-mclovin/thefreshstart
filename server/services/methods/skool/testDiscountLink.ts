
import nodemailer from "nodemailer";


async function testDiscountLink() {

    console.log('testing discount link');

    const zohoHost = process.env.ZOHO_APP_HOST;
    const zohoUser = process.env.ZOHO_NO_REPLY_USER;
    const zohoPass = process.env.ZOHO_APP_PASSWORD;

    // console.log(zohoHost, zohoUser, zohoPass, 'zoho variables');

    // return


  try {
    const discountCode = `BOOK50-${Date.now()}`
    const variantGID = "gid://shopify/ProductVariant/49305684803752"

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

    const variantId = "49305684803752"
    const discountLink = `https://${process.env.SHOPIFY_STORE_DOMAIN}/cart/${variantId}:1?discount=${discountCode}`

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

    const sendEmail = await transporter.sendMail({
        from: `"Mail theme" <${process.env.ZOHO_NO_REPLY_USER}>`,
        to: 'nick7.dev@gmail.com',
        subject: 'Shopify discount link',
        text: `Hi there here your link ${discountLink}`

    })

    console.log("Email sent:", sendEmail)

    return {
      success: true,
      discountCode,
      discountLink,
      sendEmail
    }
  } catch (err) {
    console.error("Shopify error:", err)
    return {
      success: false,
      error: String(err),
    }
  }



}



export default testDiscountLink;