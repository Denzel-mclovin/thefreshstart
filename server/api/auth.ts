import { defineEventHandler } from "#imports";

import bcrypt from 'bcrypt';

import {
    adminLogin,
    sellerLogin
} from "../services/authServices";


export default defineEventHandler( async (event) => {
    const method = event.node.req.method;
    const query = getQuery(event);

    switch(method) {
        case "GET":
            break;
        case "POST":

            if (query.method === 'admin_login') {

                const body = await readBody<{ username: string, password: string, rememberMe: boolean}>(event);
                return await adminLogin({username: body.username, password: body.password, rememberMe: body.rememberMe, event: event}   );
            }

            if (query.method === 'seller_login') {

                const body = await readBody<{ username: string, password: string, rememberMe: boolean}>(event);
                return await sellerLogin({username: body.username, password: body.password, rememberMe: body.rememberMe, event: event});
            }
            break;
        case "PATCH":
            break;
        case "DELETE":
            break;
    }
})

