import { prisma } from '../../../../prisma/prisma';


interface reserveBookData {
    userEmail: string;
    subscriptionEmail: string;
    bookId: string;
    userName: string;
    // reservationId: string
}


async function reserveDiscountBook({ userEmail, subscriptionEmail, bookId, userName }: reserveBookData) {




    try {

        const currentUser = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        })

        console.log(currentUser, "currentUser");

        if (!currentUser) {
            await prisma.user.create({
                data: {
                    email: userEmail,
                    name: userName,
                    skoolUserEmail: userEmail,
                    selectedVarId: bookId
                }
            })
            // console.log("User not found");
            // return {
            //     message: "User not found",
            // }
        }


        // OLD CALLBACK FLOW

        // await prisma.callback.update({
        //     where: {
        //         id: reservationId
        //     },
        //     data: {
        //         status: "PURCHASED"
        //     }
        // })

        const updateUserDiscount = await prisma.user.update({
            where: {
                email: userEmail
            },
            data: {
                skoolUserEmail: userEmail,
                selectedVarId: bookId,
                isBookDiscount: true
            }
        })

        return {
            data: updateUserDiscount,
            message: "Success",

        }



        // await prisma.user.update({
        //     where: {
        //         skoolUserEmail: userEmail
        //     },
        //     data: {
        //         subscriptionEmail,
        //         bookId
        //     }
        // })


    } catch (err) {

        console.log(`Something went wrong ${err}`);
    }


}



export default reserveDiscountBook;