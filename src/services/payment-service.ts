import { getSubscriptionPrice, validatePaymentAmount } from "../config/pricing";
import { db } from "../db/db";
import { ValidationError } from "../errors/server_errors";
import { isValidStatusPayment, isValidSubscriptionPlan } from "./subscription-service";


export const createPayment = async (userId: string, amount: number, plan: string, paymentMethod: string, status: string, transactionId: string) => {
   if (!isValidSubscriptionPlan(plan)) {
    throw new ValidationError("Invalid subscription plan");
  }
  
  if (!isValidStatusPayment(status)){
    throw new ValidationError("Invalid payment status")
  }
  if (!validatePaymentAmount(plan, amount)) {
    const expectedAmount = getSubscriptionPrice(plan);
    throw new ValidationError(
      `Invalid amount. Expected ${expectedAmount} but received ${amount}`
    );
  }
  return await db.payment.create({
    data: { 
      userId: userId,
      amount: amount,
      currency: "ARS",
      plan: plan,
      paymentMethod: paymentMethod,
      status:status,
      transactionId: transactionId,
    }
  });
};

export const updatePayment = async (transactionId: string, status: string) => {
  if (!isValidStatusPayment(status)){
    throw new Error("No es un estado valido de pago")
  }
  return await db.payment.update({
    where: { transactionId }, // ✅ equivalent to transactionId: transactionId
    data: { status },         // ✅ set the fields you want to update
  });
};


export const getPaymentsByUserId = async (userId: string) => {
  return await db.payment.findMany({
    where: { userId },
    orderBy: { created_at: 'desc' }
  });
};

export const getPaymentById = async (paymentId: string) => {
  return await db.payment.findUnique({
    where: { id: paymentId }
  });
};

export const getPaymentsByUserIdPaginated = async (
  userId: string, 
  skip: number = 0, 
  take: number = 10
) => {
  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
      skip,
      take
    }),
    db.payment.count({ where: { userId } })
  ]);

  return {
    payments,
    total,
    hasMore: skip + take < total
  };
};