import { findContactByEmail } from "../../../utils/active-campaign/contacts";



export default defineEventHandler(async (event) => {
    const { email } = await readBody(event);
    return await findContactByEmail(email);
});