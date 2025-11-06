import express from "express";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { createPayment, updatePayment } from "../services/payment-service";
import { getSubscriptionPrice } from "../config/pricing";
import MercadoPagoConfig, { Payment, PreApproval } from "mercadopago";
import { getUserById, getUserPersonalInfoByID } from "../services/user-service";
import { ValidationError } from "../errors/server_errors";
import { createSubscriptionForUser, getSubscriptionByTransactionId, getSubscriptionByUserId, isValidSubscriptionPlan, updateSubscription } from "../services/subscription-service";
import { PaymentStatus, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import crypto from "crypto";

export const subscriptionRouter = express.Router();
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;
export const mercadopago = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })

subscriptionRouter.post("/", isAuthMiddleware, async (req, res, next) => {
  try {
   
    const user = req.user as UserFromToken;
    const { plan, email } = req.body;

    if (!isValidSubscriptionPlan(plan)) {
      throw new ValidationError("No es un plan valido de Nitro")
    }
    const preapproval = new PreApproval(mercadopago);
    const amount = getSubscriptionPrice(SubscriptionPlan.PAINT_NITRO)
    const subscription = await preapproval.create({
      body: {
        back_url: process.env.FRONTEND_PATH + "/nitro-success",
        reason: "Paint Nitro",
        auto_recurring: {
          frequency: 1,
          transaction_amount: amount,
          frequency_type: "months",
          currency_id: "ARS",
          start_date: new Date().toISOString(),
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        },
        payer_email: email,
        status: "pending",
        external_reference: user.id

      },
    });
    if (!subscription || !subscription.id) {
      throw new ValidationError("No valid subscription created")
    }
    await createSubscriptionForUser(user.id, SubscriptionPlan.PAINT_NITRO, subscription.id)

    res.status(200).json({ "init_point": subscription.init_point })


  } catch (error) {
    next(error)
  }
});




subscriptionRouter.post("/webhook", async (req, res, next) => {
  try {
    
    const body = req.body;
    // Mercado Pago puede enviar diferentes tipos de notificación
    // Nos interesa solo "subscription_preapproval"
    switch (body.action) {
      case "payment.created":
        const paymentId = body.data.id;
        const payment = await new Payment(mercadopago).get({ id: paymentId });
        const userId = payment.external_reference
        if (!userId || !payment.id) {
          throw new Error("No hay external reference")
        }
        const subscription = await getSubscriptionByUserId(userId);
        if (!subscription) {
          throw Error("Error al crear el pago, no existe subscripcion asociada al usuario")
        }
        const amount = payment.transaction_amount || 0;
        
        await createPayment(userId, amount, subscription.plan,"Mercado pago", PaymentStatus.COMPLETED, (payment.id).toString())
        break;
      case "created":
        break;
      case "updated":
        if (body.entity == "preapproval") {
          if (body.type === "subscription_preapproval") {
            const subscriptionId = body.data.id;
            if (!subscriptionId) {
              console.warn("Webhook recibido sin ID de suscripción");
              return res.sendStatus(400);
            }

            // Obtenemos la info completa de la suscripción desde Mercado Pago
            const preapproval = await new PreApproval(mercadopago).get({ id: subscriptionId });


            // Según el estado actualizamos la base de datos
            switch (preapproval.status) {
              case "authorized":
                
                await updateSubscription(subscriptionId, SubscriptionStatus.ACTIVE, preapproval.next_payment_date)
                break;

              case "pending":
                break;
              case "cancelled":
                await updateSubscription(subscriptionId, SubscriptionStatus.CANCELLED)
                break;
              case "expired":
                await updateSubscription(subscriptionId, SubscriptionStatus.EXPIRED)
                break;
              case "paused":

                break;

              default:
                console.log("Estado de suscripción no manejado:", preapproval.status);
            }
          }
          break;
        }
    }
    res.sendStatus(200)
    return;


    // Siempre responder 200, incluso si el tipo no nos interesa
    res.sendStatus(200);
  } catch (err) {
    console.error("Error en webhook Mercado Pago:", err);
    // Solo devolver error si realmente queremos que Mercado Pago reintente
    res.sendStatus(500);
  }
});

subscriptionRouter.get("/me", isAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const subscription = await getSubscriptionByUserId(user.id);

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No active subscription found"
      });
    }
    const amount = getSubscriptionPrice(subscription.plan)

    res.status(200).json({
      success: true,
      data: {...subscription, amount}
    });
  } catch (error) {
    next(error);
  }
});

// Cancelar suscripción
subscriptionRouter.post("/cancel", isAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const subscription = await getSubscriptionByUserId(user.id);

    if (!subscription) {
      throw new ValidationError("No active subscription found");
    }

    // Cancelar en Mercado Pago
    if (subscription.transactionId) {
      const preapproval = new PreApproval(mercadopago);
      await preapproval.update({
        id: subscription.transactionId,
        body: { status: "cancelled" }
      });
    }

    // Actualizar en la base de datos
    await updateSubscription(subscription.transactionId!, SubscriptionStatus.CANCELLED);

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully"
    });
  } catch (error) {
    next(error);
  }
});