import { db } from "./db";

async function deleteSubscriptions() {
  try {
    
    await db.subscription.deleteMany({})
    await db.payment.deleteMany({})
    console.log("Eliminado correctamente")
  } catch (error) {
    console.error("❌ Error checking payments:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

deleteSubscriptions();