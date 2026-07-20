import { prisma } from "../../../../prisma/prisma";

async function reserveSlot(date: string, time: string) {


    try{

        await prisma.callbackReservation.deleteMany({
            where: { expiresAt: { lt: new Date() } }
        });

        const exists = await prisma.callbackReservation.findFirst({
            where: { date: new Date(date), time }
        });

        if (exists) {
            return { success: false, message: 'This time already reserved' };
        }

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const reservation = await prisma.callbackReservation.create({
            data: { date: new Date(date), time, expiresAt }
        });

        return { success: true, reservationId: reservation.id };

    } catch (error) {
        message: "Something went wrong";
        error
    }
}

export default reserveSlot;