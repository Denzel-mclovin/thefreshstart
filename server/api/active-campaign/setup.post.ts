import { defineEventHandler } from "h3";
import { activeCampaign } from "../../utils/activeCampaingClient";

const fields = [
  {
    title: "Q1 — Remote Work",
    type: "dropdown",
    options: ["yes", "no"],
  },
  {
    title: "Q2 — Time Commitment",
    type: "dropdown",
    options: ["yes", "no"],
  },
  {
    title: "Q3 — Independent Decisions",
    type: "dropdown",
    options: ["yes", "no"],
  },
  {
    title: "Q4 — Financial Readiness",
    type: "dropdown",
    options: ["yes", "week", "affirm", "no"],
  },
  {
    title: "Q5 — Relocation Concern",
    type: "dropdown",
    options: ["health", "lifestyle", "dating", "finances", "family"],
  },
  {
    title: "Q5 — Concern Free Text",
    type: "text",
  },
  {
    title: "Financing Flag",
    type: "dropdown",
    options: ["true", "false"],
  },
  {
    title: "UTM Source",
    type: "text",
  },
  {
    title: "UTM Medium",
    type: "text",
  },
  {
    title: "UTM Campaign",
    type: "text",
  },
  {
    title: "UTM Content",
    type: "text",
  },
  {
    title: "FB Click ID",
    type: "text",
  },
  {
    title: "FBC",
    type: "text",
  },
  {
    title: "FBP",
    type: "text",
  },
  {
    title: "Referrer",
    type: "text",
  },
  {
    title: "Landing Page",
    type: "text",
  },
];

export default defineEventHandler(async () => {
  const response = await activeCampaign.get("fields") as any;
  const existingFields = response.fields || [];

  const deleted = [];

  for (const field of existingFields) {
    await activeCampaign.delete(`fields/${field.id}`);

    deleted.push({
      id: field.id,
      title: field.title,
    });
  }

  const created = [];

  for (const field of fields) {
    const result = await activeCampaign.post("fields", {
      field: {
        title: field.title,
        type: field.type,
      },
    }) as any;

    const createdField = result.field;

    if (field.options?.length) {
      await activeCampaign.post("fieldOption/bulk", {
        fieldOptions: field.options.map((option, index) => ({
          orderid: index + 1,
          value: option,
          label: option,
          isdefault: false,
          field: createdField.id,
        })),
      });
    }

    created.push({
      id: createdField.id,
      title: createdField.title,
      type: createdField.type,
      perstag: createdField.perstag,
      options: field.options || [],
    });
  }

  return {
    success: true,
    deleted,
    created,
  };
});