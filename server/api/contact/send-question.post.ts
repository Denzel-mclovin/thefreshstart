import { defineEventHandler, useRuntimeConfig } from "#imports";
import { Resend } from 'resend';


export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig();

    const {question, token} = await readBody(event);

    const resend = new Resend(config.resendApiKey);

    if (!question || !token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request, missing data'
        })
    }

    try {

        const res = await $fetch(
            'https://www.google.com/recaptcha/api/siteverify',
            {
            method: 'POST',
            body: new URLSearchParams({
                secret: config.recaptchaSecretKey,
                response: token
            })
            }
        ) as any;

        if (!res.success) {
            throw createError({
            statusCode: 403,
            statusMessage: 'Recaptcha failed'
            })
        }

        if (res.action !== 'faq_form') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Invalid action'
            })
        }

        if (res.score < 0.5) {
            throw createError({
            statusCode: 403,
            statusMessage: 'Bot detected'
            })
        }

        const sendEmailRes = await resend.emails.send({
            from: 'The Fresh Start <noreply@thefreshstart.net>',
            to: 'nick7.dev@gmail.com',
            subject: 'Hello World',
            html: `<p>Congrats on sending your <strong>first email</strong>! <br/> ${question}</p>`
            // replyTo: ""
        });

        if (!sendEmailRes.error) {
            console.log('Email sent');
            return ({
                success: true,
                statusCode: 200,
                message: 'Email sent'
            })
        }
         
    } catch (err) {

        console.log(err);

          throw createError({
                statusCode: 500,
                statusMessage: 'Failed to send email'
            })

    }
})