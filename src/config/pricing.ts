// config/pricing.ts
import { SubscriptionPlan } from "@prisma/client";

export const SUBSCRIPTION_PRICES = {
  [SubscriptionPlan.FREE]: 0,
  [SubscriptionPlan.PAINT_NITRO]: 15, // por mes en pesos argentinos 
} as const;

export function getSubscriptionPrice(plan: SubscriptionPlan): number {
  return SUBSCRIPTION_PRICES[plan];
}

export function validatePaymentAmount(plan: SubscriptionPlan, amount: number): boolean {
  return amount === SUBSCRIPTION_PRICES[plan];
}