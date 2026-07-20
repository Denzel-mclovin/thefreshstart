import { prisma } from "../../../../prisma/prisma";



async function getLocation(event: any) {

    const ip = getRequestIP(event, { xForwardedFor: true });

    // const GermanIp = '88.198.24.108';
    // const UsaIp = '8.8.8.8';
    // const PolandIp = '217.239.63.12';

    try {

        const res = await $fetch(`https://ipwho.is/${ip}`)

        return {
            statusCode: 200,
            message: "Success",
            data: res
        }



    } catch (err) {

        console.log(`Error getting location: ${err}`)
        return {
            statusCode: 500,
            message: "Error getting location",
            error: err
        }
    }
}

export default getLocation;