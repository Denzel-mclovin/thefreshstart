import { prisma } from "../../../../prisma/prisma";





async function GetUsersList() {


    try {

        const getLinks = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return {
            statusCode: 200,
            message: "Success",
            data: getLinks  
        }

    } catch (err) {

        console.log(`Something went wrong ${err}`);

        return {
            statusCode: 500,
            message: `Something went wrong ${err}`,
            err: err
        }

    }
}



export default GetUsersList;