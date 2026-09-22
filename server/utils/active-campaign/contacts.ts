import { activeCampaign } from "../activeCampaingClient";
import { ACTIVE_CAMPAIGN_FIELDS } from "./fields";

type ActiveCampaignContact = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type ContactsResponse = {
  contacts: ActiveCampaignContact[];
};

type ContactResponse = {
  contact: ActiveCampaignContact;
};

type ContactData = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;

  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q5FreeText?: string;

  financingFlag?: boolean;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;

  fbclid?: string;
  fbc?: string;
  fbp?: string;

  referrer?: string;
  landingPage?: string;
};

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const buildFieldValues = (data: ContactData) => {
  const fields = [
    [ACTIVE_CAMPAIGN_FIELDS.Q1_REMOTE_WORK, data.q1],
    [ACTIVE_CAMPAIGN_FIELDS.Q2_TIME_COMMITMENT, data.q2],
    [ACTIVE_CAMPAIGN_FIELDS.Q3_INDEPENDENT_DECISIONS, data.q3],
    [ACTIVE_CAMPAIGN_FIELDS.Q4_FINANCIAL_READINESS, data.q4],
    [ACTIVE_CAMPAIGN_FIELDS.Q5_RELOCATION_CONCERN, data.q5],
    [ACTIVE_CAMPAIGN_FIELDS.Q5_CONCERN_FREE_TEXT, data.q5FreeText],
    [
      ACTIVE_CAMPAIGN_FIELDS.FINANCING_FLAG,
      data.financingFlag !== undefined
        ? String(data.financingFlag)
        : undefined,
    ],

    [ACTIVE_CAMPAIGN_FIELDS.UTM_SOURCE, data.utmSource],
    [ACTIVE_CAMPAIGN_FIELDS.UTM_MEDIUM, data.utmMedium],
    [ACTIVE_CAMPAIGN_FIELDS.UTM_CAMPAIGN, data.utmCampaign],
    [ACTIVE_CAMPAIGN_FIELDS.UTM_CONTENT, data.utmContent],

    [ACTIVE_CAMPAIGN_FIELDS.FB_CLICK_ID, data.fbclid],
    [ACTIVE_CAMPAIGN_FIELDS.FBC, data.fbc],
    [ACTIVE_CAMPAIGN_FIELDS.FBP, data.fbp],

    [ACTIVE_CAMPAIGN_FIELDS.REFERRER, data.referrer],
    [ACTIVE_CAMPAIGN_FIELDS.LANDING_PAGE, data.landingPage],
  ];

  return fields
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([field, value]) => ({
      field,
      value,
    }));
};

export const getContacts = async () => {
  const response = await activeCampaign.get("contacts") as ContactsResponse;

  return response?.contacts || [];
};

export const findContactByEmail = async (email: string) => {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email");
  }

  const response = await activeCampaign.get(
    `contacts?filter[email]=${encodeURIComponent(email)}`
  ) as ContactsResponse;

  return (
    response?.contacts?.find(
      (contact) => contact.email?.toLowerCase() === email.toLowerCase()
    ) || null
  );
};

export const createContact = async (data: ContactData) => {
  if (!isValidEmail(data.email)) {
    throw new Error("Invalid email");
  }

  const fieldValues = buildFieldValues(data);

  const response = await activeCampaign.post("contacts", {
    contact: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      fieldValues,
    },
  }) as ContactResponse;

  return response?.contact;
};

export const updateContact = async (
  contactId: string,
  data: Partial<ContactData>
) => {
  if (data.email && !isValidEmail(data.email)) {
    throw new Error("Invalid email");
  }

  const fieldValues = buildFieldValues(data as ContactData);

  const contact: Record<string, any> = {};

  if (data.email !== undefined) {
    contact.email = data.email;
  }

  if (data.firstName !== undefined) {
    contact.firstName = data.firstName;
  }

  if (data.lastName !== undefined) {
    contact.lastName = data.lastName;
  }

  if (data.phone !== undefined) {
    contact.phone = data.phone;
  }

  if (fieldValues.length) {
    contact.fieldValues = fieldValues;
  }

  const response = await activeCampaign.put(
    `contacts/${contactId}`,
    {
      contact,
    }
  ) as ContactResponse;

  return response?.contact;
};

export const syncContact = async (data: ContactData) => {
  if (!isValidEmail(data.email)) {
    throw new Error("Invalid email");
  }

  const fieldValues = buildFieldValues(data);

  const response = await activeCampaign.post("contact/sync", {
    contact: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      fieldValues,
    },
  }) as ContactResponse;

  return response?.contact;
};

export const createOrUpdateContact = async (data: ContactData) => {
  return await syncContact(data);
};