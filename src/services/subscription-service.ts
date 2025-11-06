import { PaymentStatus, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { db } from "../db/db";
import { ValidationError } from "../errors/server_errors";
import { Prisma } from "@prisma/client";

export function isValidSubscriptionPlan(plan: string): plan is SubscriptionPlan {
  return Object.values(SubscriptionPlan).includes(plan as SubscriptionPlan);
}

export function isValidStatusPayment(status: string): status is PaymentStatus {
  return Object.values(PaymentStatus).includes(status as PaymentStatus)
}

export function isValidSubscriptionStatus(status: string): status is SubscriptionStatus {
     return Object.values(SubscriptionStatus).includes(status as SubscriptionStatus)
}


export const createSubscriptionForUser = async (
  userId: string,
  plan: string,
  transactionId: string
) => {
  if (!isValidSubscriptionPlan(plan)) {
    throw new ValidationError("Invalid subscription plan");
  }

  try {
    return await db.subscription.create({
      data: {
        userId,
        status: "INACTIVE",
        plan,
        transactionId,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),

      },
    });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 => Unique constraint failed
      throw new ValidationError(
        "This user already has an active or pending subscription."
      );
    }
    throw error; // rethrow other errors
  }
};


export const updateSubscription = async (transactionId: string, status: string) => {
  try {
    if (!isValidSubscriptionStatus(status)){
      throw new Error("No existe ese status")
    }
    const subscription = await db.subscription.update({
      where: { transactionId },
      data: { status },
    });

    return subscription;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // P2025 => No record found for update
      throw new ValidationError(
        "No subscription found with the provided transaction ID."
      );
    }
    throw error;
  }
};

export const getSubscriptionByUserId = async (userId: string) => {
  return db.subscription.findUnique({where: {userId}})
}

export const getSubscriptionByTransactionId = async (transaction: string) => {
  return db.subscription.findUnique({where: {transactionId: transaction}})
}