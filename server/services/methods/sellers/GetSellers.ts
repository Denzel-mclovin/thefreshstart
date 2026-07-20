import { prisma } from "../../../../prisma/prisma";



async function GetSellersList() {


    try {

        const fetchSellersList = await prisma.seller.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                sessions: {
                include: {
                    user: {
                    include: {
                        subscriptions: true,
                        payments: true,
                    },
                    },
                },
                },
            },
        })

       const sellersWithUsers = fetchSellersList.map(seller => {
            const usersMap = new Map<string, any>();

            seller.sessions.forEach(session => {
                if (session.user) {
                usersMap.set(session.user.id, session.user);
                }
            });

            return {
                ...seller,
                users: Array.from(usersMap.values()),
            };
        });

        return {
            statusCode: 200,
            message: "Success",
            data: sellersWithUsers
        }

    } catch ( err ) {
        console.log(`Something went wrong ${err}`);
        return {
            statusCode: 500,
            message: `Something went wrong ${err}`,
            err: err
        }
    }



}



export default GetSellersList;