import { prisma }  from '../../../../prisma/prisma';

function generateSlots(startHour = 8, endHour = 16, stepMinutes = 30): string[] {
    const slots: string[] = [];

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += stepMinutes) {
        if (hour === endHour && minute > 0) break; 
        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
        }
    }

return slots;
}

async function getAvailableSlots(prop: any): Promise<{ message: string; data?: string[]; error?: any }> {

    const date = new Date(prop as string);

    try{

        await prisma.callbackReservation.deleteMany({
            where: { expiresAt: { lt: new Date() } }
        });


        const reservedSlots = await prisma.callbackReservation.findMany({
            where: { date },
            select: { time: true }
        });

        const allSlots = generateSlots(8, 16, 30);

        const availableSlots = allSlots.filter(slot => 
            !reservedSlots.some(res => res.time === slot)
        );

        return {
            message: "Success",
            data: availableSlots
        }


    } catch (error) {
        return {
            message: "No data received",
            error: error
        }
    }

};

export default getAvailableSlots;