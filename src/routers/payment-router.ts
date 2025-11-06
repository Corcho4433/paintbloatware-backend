import express from "express";
import { isAuthMiddleware, type UserFromToken } from "../middleware/authMiddleware";
import { getPaymentsByUserId, getPaymentsByUserIdPaginated } from "../services/payment-service";
import { getSubscriptionByUserId } from "../services/subscription-service";

export const paymentRouter = express.Router();

// Obtener historial de pagos del usuario autenticado
paymentRouter.get("/history", isAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const result = await getPaymentsByUserIdPaginated(user.id, skip, limit);

    res.status(200).json({
      success: true,
      data: {
        payments: result.payments,
        pagination: {
          page,
          limit,
          total: result.total,
          hasMore: result.hasMore,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Obtener todos los pagos (sin paginación)
paymentRouter.get("/", isAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const payments = await getPaymentsByUserId(user.id);

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
});

// Obtener resumen de pagos
paymentRouter.get("/summary", isAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user as UserFromToken;
    const payments = await getPaymentsByUserId(user.id);

    const summary = {
      totalPayments: payments.length,
      totalSpent: payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0),
      successfulPayments: payments.filter(p => p.status === 'COMPLETED').length,
      failedPayments: payments.filter(p => p.status === 'FAILED').length,
      pendingPayments: payments.filter(p => p.status === 'PENDING').length,
      lastPayment: payments[0] || null
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
});