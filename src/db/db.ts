import { PrismaClient } from '@prisma/client'

const prismaBase = new PrismaClient();


export const db = prismaBase.$extends({
  result: {
    user: {
      nitro: {
        // @ts-ignore 
        needs: { subscription: true },
        compute(user) {
          return !!(
            user.subscription?.endDate && 
            user.subscription.endDate > new Date()
          );
        },
      },
    },
  },
});