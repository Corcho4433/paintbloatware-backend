import { getSubscriptionPrice, validatePaymentAmount } from "../config/pricing";
import { db } from "../db/db";
import { ValidationError } from "../errors/server_errors";
import { isValidStatusPayment, isValidSubscriptionPlan } from "./subscription-service";


export const createPayment = async (userId: string, amount: number, plan: string, paymentMethod: string, status: string) => {
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
    }
  });
};