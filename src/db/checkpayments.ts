import { db } from "./db";

async function checkPayments() {
  try {
    console.log("=== 🔍 Checking Database Tables ===\n");
    
    // Obtener todas las suscripciones
    const subscriptions = await db.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log(`📋 SUBSCRIPTIONS (${subscriptions.length} total):`);
    console.log("─".repeat(80));
    
    if (subscriptions.length === 0) {
      console.log("  No subscriptions found\n");
    } else {
      subscriptions.forEach((sub, index) => {
        console.log(`\n${index + 1}. Subscription ID: ${sub.id}`);
        console.log(`   User: ${sub.user?.name || 'N/A'} (${sub.user?.email || 'N/A'})`);
        console.log(`   Plan: ${sub.plan}`);
        console.log(`   Status: ${sub.status}`);
        console.log(`   Start Date: ${sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}`);
        console.log(`   End Date: ${sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}`);
        console.log(`   Cancel at Period End: ${sub.cancelAtPeriodEnd ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(sub.created_at).toLocaleString()}`);
      });
      console.log("\n");
    }

    // Obtener todos los pagos
    const payments = await db.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log(`💰 PAYMENTS (${payments.length} total):`);
    console.log("─".repeat(80));
    
    if (payments.length === 0) {
      console.log("  No payments found\n");
    } else {
      payments.forEach((payment, index) => {
        console.log(`\n${index + 1}. Payment ID: ${payment.id}`);
        console.log(`   User: ${payment.user?.name || 'N/A'} (${payment.user?.email || 'N/A'})`);
        console.log(`   Amount: ${payment.currency} ${payment.amount.toFixed(2)}`);
        console.log(`   Status: ${payment.status}`);
        console.log(`   Plan: ${payment.plan}`);
        console.log(`   Payment Method: ${payment.paymentMethod || 'N/A'}`);
        console.log(`   Transaction ID: ${payment.transactionId || 'N/A'}`);
        console.log(`   Description: ${payment.description || 'N/A'}`);
        console.log(`   Created: ${new Date(payment.created_at).toLocaleString()}`);
      });
      console.log("\n");
    }

    // Resumen
    console.log("=== 📊 SUMMARY ===");
    console.log(`Total Subscriptions: ${subscriptions.length}`);
    console.log(`  - Active: ${subscriptions.filter(s => s.status === 'ACTIVE').length}`);
    console.log(`  - Inactive: ${subscriptions.filter(s => s.status === 'INACTIVE').length}`);
    console.log(`  - Cancelled: ${subscriptions.filter(s => s.status === 'CANCELLED').length}`);
    console.log(`  - Expired: ${subscriptions.filter(s => s.status === 'EXPIRED').length}`);
    
    console.log(`\nTotal Payments: ${payments.length}`);
    console.log(`  - Completed: ${payments.filter(p => p.status === 'COMPLETED').length}`);
    console.log(`  - Pending: ${payments.filter(p => p.status === 'PENDING').length}`);
    console.log(`  - Failed: ${payments.filter(p => p.status === 'FAILED').length}`);
    console.log(`  - Refunded: ${payments.filter(p => p.status === 'REFUNDED').length}`);
    
    const totalRevenue = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);
    console.log(`\nTotal Revenue (Completed): ARS ${totalRevenue.toFixed(2)}`);

  } catch (error) {
    console.error("❌ Error checking payments:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

checkPayments();