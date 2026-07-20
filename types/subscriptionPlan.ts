export interface SubscriptionPlanData {
    subName?: string;
    amount: number;
    priceId: string;
    subDescription?: string | null;
    paymentLink: string;
    subStatus: "active" | "deactivate";
}

export interface UpdatePlanData {
  subName?: string;
  amount: number;
  priceId: string;
  subDescription?: string | null;
  paymentLink?: string;
  subStatus?: "active" | "deactivate";
}