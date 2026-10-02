import { getContacts } from "../../../utils/active-campaign/contacts"


export default defineEventHandler(async (event) => {

    const contacts = await getContacts();

    return contacts;


});