import nodemailer from 'nodemailer'
import handlebars from 'handlebars'
import getEmailAttachments from './getEmailAttachments'


// import subscriptionTemplate from '../../assets/email/subscription-ntf.hbs?raw'


const subscriptionTemplate = `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>{{subject}}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f2f0f5;
        font-family: "Arial", sans-serif;
        color: #333;
      }

      .wrapper {
        max-width: 700px;
        margin: 40px auto;
        background: #f8f7fb;
        border: 2px solid #480074;
        border-radius: 16px;
        box-shadow: 8px 8px 16px rgba(72, 0, 116, 0.15),
          -8px -8px 16px rgba(255, 255, 255, 0.8);
        overflow: hidden;
      }

      .banner {
        width: 100%;
        display: block;
      }

      .content {
        padding: 32px 28px;
        text-align: start;
      }

      h1 {
        color: #480074;
        font-size: 1.5rem;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 1.4rem;
      }

      p, .text {
        font-size: 1.2rem;
        line-height: 1.2;
        margin-bottom: 20px;
      }

      strong {
        font-size: 1.2rem;
      }

      .button-wrapper {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      a.button {
        display: inline-block;
        background: #480074;
        color: white !important;
        text-decoration: none;
        padding: 12px 28px;
        border-radius: 8px;
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0 auto;
      }

      .hyperlink {
        color: #480074 !important;
        text-decoration: none;
        cursor: pointer;
        font-weight: 600;
        font-size: 1.1rem;
      }

      .hyperlink-description {
        font-size: 1.2rem;
        padding-right: 10px;
        font-weight: 600;
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <!-- Header banner -->
      <img
        src="cid:banner"
        alt="Header Banner"
        class="banner"
        style="width: 100%; height: 15vh; object-fit: cover"
      />

      <div class="content">
        <h1>Dear {{clientName}},</h1>
        <p>
          You’re just one step away from changing your life through our
          consulting program. To activate your subscription and begin receiving
          access to your consulting services, simply click the secure enrollment
          link below:
        </p>
        <br />

        <div class="button-wrapper">
          <a href="{{link}}" class="button">Subscription Link</a>
        </div>
        <br />
        <p>
          Once you complete checkout, your subscription will be live and you’ll
          gain full access to our monthly consulting services. Please note that,
          as with any professional subscription service, certain general terms
          and conditions apply. For your convenience, they are outlined below in
          detail.
        </p>
        
        <h2>
          Terms & Conditions Overview 
        </h2>

        <ul>
          <li>
            <strong>
              Subscription Activation: 
            </strong>
            <span class="text">
              Your subscription begins immediately upon completing the checkout link
              above. Services are delivered on a month-to-month basis.
            </span>
       

          </li>
          <li>
            <strong>
              Billing Authorization:
            </strong>
            <span class="text">
              By subscribing, you authorize automatic recurring
              monthly charges to your chosen payment method until cancellation.   
            </span>
        
          </li>
          <li>
            <strong>
              Refund Policy: 
            </strong>
            <span class="text">
              All subscription payments are final and non-refundable.
              Retroactive cancellations or disputes will not be honored once payment
              has been processed in line with these terms.
              
            </span>
           
          </li>
          <li>
            <strong>
              Client Responsibility:
            </strong>
            <span class="text">
              Managing, updating, or cancelling your subscription is your sole
              responsibility. We do not process cancellation requests via phone,
              text, or email.
              
            </span>

          </li>
          <li>
            <strong>
              Customer Portal Access: 
            </strong>
            <span class="text">
              You can update payment details, review billing history, 
              or cancel future billings at any time through our secure <br> Stripe Customer Portal:
              
            </span>

         
            <br />
            <br />
            <a
              href="https://billing.stripe.com/p/login/aEUbJm9EG91Vexa3cc"
              class="hyperlink"
              ><span class="text" class="hyperlink-description"> 👉 </span> &nbsp;
              https://billing.stripe.com/p/login/aEUbJm9EG91Vexa3cc</a
            >
            <br />
            <br />

          </li>
          <li>
            <strong>
              Acknowledgment of Terms: 
            </strong>
            <span class="text">
              By completing your checkout, you confirm that
              you have reviewed and agreed to these subscription terms. We look
              forward to helping you achieve lasting results through this program.
              Sincerely, Mystic Visions
              
            </span>
              

          </li>
        </ul>
          

        
        <p>
        
        </p>
      </div>

      <!-- Footer (optional) -->
      <footer
        class="body"
        style="
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
          min-width: 100% !important;
          width: 100% !important;
          -webkit-text-size-adjust: none;
        "
      >
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" valign="top">
              <table width="600" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td
                    style="
                      width: 600px;
                      min-width: 600px;
                      font-size: 0px;
                      line-height: 0px;
                      margin: 0;
                      font-weight: normal;
                    "
                  >
                    <table
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <tr>
                        <td>
                          <table
                            width="100%"
                            border="0"
                            cellspacing="0"
                            cellpadding="0"
                          >
                            <tr>
                              <td style="background-color: #fff" bgcolor="#fff">
                                <table
                                  width="100%"
                                  border="0"
                                  cellspacing="0"
                                  cellpadding="0"
                                >
                                  <tr>
                                    <td
                                      style="
                                        height: 85px;
                                        background-color: #f8aa28;
                                        text-align: center;
                                        vertical-align: bottom;
                                      "
                                      align="center"
                                      valign="bottom"
                                      bgcolor="#F8AA28"
                                      colspan="6"
                                    >
                                      <a href="#"
                                        ><img
                                          src="cid:footer-logo"
                                          border="0"
                                          width="71"
                                          style="width: 71px; height: auto"
                                      /></a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style="
                                        height: 50px;
                                        background-color: #f8aa28;
                                        text-align: center;
                                        vertical-align: bottom;
                                      "
                                      align="center"
                                      valign="bottom"
                                      bgcolor="#F8AA28"
                                      colspan="6"
                                    >
                                      <img
                                        src="cid:footer-stripe"
                                        border="0"
                                        width="600"
                                        style="width: 600px; height: auto"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style="
                                        width: 211px;
                                        height: 55px;
                                        text-align: right;
                                        vertical-align: bottom;
                                      "
                                      align="right"
                                      valign="bottom"
                                    >
                                      <a
                                        href="https://www.youtube.com/@WisdomPillar"
                                        ><img
                                          src="cid:social-youtube"
                                          border="0"
                                          width="20"
                                          style="width: 30px; height: auto"
                                      /></a>
                                    </td>
                                    <td
                                      style="
                                        width: 52px;
                                        height: 55px;
                                        text-align: right;
                                        vertical-align: bottom;
                                      "
                                      align="right"
                                      valign="bottom"
                                    >
                                      <a href="https://wa.me/+5219991901325"
                                        ><img
                                          src="cid:social-whatsapp"
                                          border="0"
                                          width="20"
                                          style="width: 30px; height: auto"
                                      /></a>
                                    </td>
                                    <td
                                      style="
                                        width: 52px;
                                        height: 55px;
                                        text-align: right;
                                        vertical-align: bottom;
                                      "
                                      align="right"
                                      valign="bottom"
                                    >
                                      <a href="https://t.me/pillarsofwisdom"
                                        ><img
                                          src="cid:social-tg"
                                          border="0"
                                          width="20"
                                          style="width: 30px; height: auto"
                                      /></a>
                                    </td>
                                    <td
                                      style="
                                        width: 52px;
                                        height: 55px;
                                        text-align: right;
                                        vertical-align: bottom;
                                      "
                                      align="right"
                                      valign="bottom"
                                    >
                                      <a
                                        href="https://www.instagram.com/the_pillars_of_wisdom/"
                                        ><img
                                          src="cid:social-inst"
                                          border="0"
                                          width="20"
                                          style="width: 30px; height: auto"
                                      /></a>
                                    </td>
                                    <td
                                      style="
                                        width: 52px;
                                        height: 55px;
                                        text-align: right;
                                        vertical-align: bottom;
                                      "
                                      align="right"
                                      valign="bottom"
                                    >
                                      <a href="https://twitter.com/wisdom_cards"
                                        ><img
                                          src="cid:social-x"
                                          border="0"
                                          width="20"
                                          style="width: 30px; height: auto"
                                      /></a>
                                    </td>
                                    <td style="width: 181px; height: 55px">
                                      &nbsp;
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style="
                                        height: 30px;
                                        font-family: 'Arial', sans-serif;
                                        text-align: center;
                                        vertical-align: bottom;
                                      "
                                      align="center"
                                      valign="bottom"
                                      colspan="6"
                                    >
                                      <p
                                        style="
                                          line-height: 12px;
                                          font-size: 10px;
                                          font-weight: 400;
                                          color: #808080;
                                        "
                                      >
                                        © 2025 Mystic Visions, LLC, All Rights
                                        Reserved.
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </footer>
    </div>
  </body>
</html>

`

interface IProps {
    to: string,
    subject: string,
    templateName: string,
    props: Record<string, any>
}

export async function sendSubscriptionLink({ to, subject, templateName, props }: IProps) {


const template = handlebars.compile(subscriptionTemplate)

    //   const templatePath = path.join(process.cwd(), 'server/templates/subscription-ntf.hbs')

//         if (!fs.existsSync(templatePath)) {
//             throw new Error(`Template not found: ${templatePath}`)
//         }

//          const templateSource = fs.readFileSync(templatePath, 'utf8')
//   const template = handlebars.compile(templateSource)

    // console.log( to, subject, templateName, props, 'from email util');
// const nitroApp = useNitroApp()

    // const templatePath = path.resolve(`server/assets/${templateName}.hbs`)
        // const templatePath = path.resolve(process.cwd(), 'server/assets/subscription-ntf.hbs')
        // const templatePath = nitroApp.assets.email['subscription-ntf.hbs']
        //  const template = handlebars.compile(subscriptionTemplateEmail)

        //  const html = template(props)

    // if (!fs.existsSync(templatePath)) {
    //   throw new Error(`Template not found: ${templatePath}`)
    // }
    // const source = fs.readFileSync(templatePath, 'utf-8');

    // const template = handlebars.compile(source)

    const attachments = await getEmailAttachments()

 

    console.log('template', template )
    const html = template(props)

    const transporter = nodemailer.createTransport({
        host: process.env.ZOHO_APP_HOST || "smtp.zoho.eu",
        port: 465,
        secure: true,
        auth: {
            user: process.env.ZOHO_NO_REPLY_USER,
            pass: process.env.ZOHO_APP_PASSWORD,
        }
    });

    await transporter.sendMail({
        from: `"Mystic Visions" <${process.env.ZOHO_NO_REPLY_USER}>`,
        to,
        subject,
        html,
        attachments
        // attachments: [
        //     {
        //         filename: 'banner.webp',
        //         path: '../../public/mail/banner.webp',
        //         cid: 'banner'
        //     },
        //     {
        //         filename: 'footer-logo.png',
        //         path: '../../public/mail/footer/footer-logo.png',
        //         cid: 'footer-logo'
        //     },
        //     {
        //         filename: 'footer-stripe.png',
        //         path: '../../public/mail/footer/footer-stripe.png',
        //         cid: 'footer-stripe'
        //     },
        //     {
        //         filename: 'social-youtube.png',
        //         path: '../../public/mail/footer/social-youtube.png',
        //         cid: 'social-youtube'
        //     },
        //     {
        //         filename: 'social-whatsapp.png',
        //         path: '../../public/mail/footer/social-whatsapp.png',
        //         cid: 'social-whatsapp'
        //     },
        //     {
        //         filename: 'social-tg.png',
        //         path: '../../public/mail/footer/social-tg.png',
        //         cid: 'social-tg'
        //     },
        //     {
        //         filename: 'social-inst.png',
        //         path: '../../public/mail/footer/social-inst.png',
        //         cid: 'social-inst'
        //     },
        //     {
        //         filename: 'social-x.png',
        //         path: '../../public/mail/footer/social-x.png',
        //         cid: 'social-x'
        //     },
        // ]
    })

    console.log('Email sent');

}