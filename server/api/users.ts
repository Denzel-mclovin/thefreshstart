import { defineEventHandler } from "#imports";


import { 
    GetUsersList,
    GetUser
} from "../services/usersServices";


export default defineEventHandler( async (event) => {


    const method = event.node.req.method;
    const query = getQuery(event);


console.log('enter user service')

    switch(method) {
        case "GET":

            if (query.method === 'get-users-list') {
                return await GetUsersList()
            }

            if (query.method === 'get-user') {
                console.log('entered get user');
                // const body = await readBody<({ userId: string })>(event);

                const userId = query.userId as string;

                console.log(userId);
                return await GetUser(userId);
            }
            
            break;
        case "POST":
            break;
        case "PATCH":
            break;
        case "DELETE":
            break;
    }

})