import {createOrUpdateContact} from "../../../utils/active-campaign/contacts";

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    if (!body || !body.email) {
        throw new Error("Email is required");
    }

    const contact = await createOrUpdateContact(body);

    return contact;



});