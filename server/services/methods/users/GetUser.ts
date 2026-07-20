
import { prisma } from "../../../../prisma/prisma";

const GetUser = async (id: string) => {


    try{

        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        return {
            statusCode: 200,
            message: "Success",
            data: user
        }

    } catch (err) {
        console.log(err)
    }
}


export default GetUser;