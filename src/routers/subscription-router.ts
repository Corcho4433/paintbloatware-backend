import express from "express";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { createPayment } from "../services/payment-service";
import { getSubscriptionPrice } from "../config/pricing";
import MercadoPagoConfig, { PreApproval } from "mercadopago";
import { getUserById, getUserPersonalInfoByID } from "../services/user-service";

export const subscriptionRouter = express.Router();
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;
export const mercadopago = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })

subscriptionRouter.post("/", isAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const { plan, amount, email } = req.body;
    await createPayment(user.id, amount, plan, "mercadopago", "PENDING");
    const subscription = await new PreApproval(mercadopago).create({
      body: {
        back_url: process.env.FRONTEND_PATH,
        reason: "Paint Nitro",
        auto_recurring: {
          frequency: 1,
          transaction_amount: 15,
          frequency_type: "months",
          currency_id: "ARS",
          start_date: new Date().toISOString(),
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        },
        payer_email: email,
        external_reference: user.id,
        status: "pending",
      },
    });

    console.log(subscription)
    res.status(200).json({ "init_point": subscription.init_point })

  } catch (error) {
    next(error)
  }
});


subscriptionRouter.post("/webhook", async (req, res, next) => {
  try {
    const body = req.body;
    console.log(body.type)
    // Mercado Pago puede enviar diferentes tipos de notificación
    // Nos interesa solo "subscription_preapproval"
    if (body.type === "subscription_preapproval") {
      console.log(body)
      const subscriptionId = body.id;
      console.log(subscriptionId)
      if (!subscriptionId) {
        console.warn("Webhook recibido sin ID de suscripción");
        return res.sendStatus(400);
      }

      // Obtenemos la info completa de la suscripción desde Mercado Pago
      const preapproval = await new PreApproval(mercadopago).get({ id: subscriptionId });

      console.log("Webhook recibido:", preapproval.id, preapproval.status);

      // Según el estado actualizamos la base de datos
      switch (preapproval.status) {
        case "authorized":
          console.log("loler")
          break;

        case "paused":
        case "cancelled":
        case "expired":
          console.log("dopler ")
          break;

        default:
          console.log("Estado de suscripción no manejado:", preapproval.status);
      }
    }

    // Siempre responder 200, incluso si el tipo no nos interesa
    res.sendStatus(200);
  } catch (err) {
    console.error("Error en webhook Mercado Pago:", err);
    // Solo devolver error si realmente queremos que Mercado Pago reintente
    res.sendStatus(500);
  }
});