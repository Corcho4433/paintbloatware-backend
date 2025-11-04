import { PaymentStatus, SubscriptionPlan } from "@prisma/client";
import { db } from "../db/db";
import { ValidationError } from "../errors/server_errors";

export function isValidSubscriptionPlan(plan: string): plan is SubscriptionPlan {
  return Object.values(SubscriptionPlan).includes(plan as SubscriptionPlan);
}

export function isValidStatusPayment(status: string): status is PaymentStatus {
  return Object.values(PaymentStatus).includes(status as PaymentStatus)
}

export const createSubscriptionForUser = async (userId: string, plan: string) => {

  if (!isValidSubscriptionPlan(plan)) {
    throw new ValidationError("Invalid subscription plan");
  }
  return await db.subscription.create({
    data: {
      userId,
      status: "ACTIVE",
      plan: plan,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year subscription
    }
  });

};


