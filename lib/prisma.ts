// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const getUnprocessedDonations = async () => {
  return await prisma.donation.findMany({
    where: {
      processed: false, // Ensure the 'processed' field is in your Donation model
    },
  })
}

export const getDonorsMatchedAmounts = async (donorIds: string[]) => {
  const matchedAmounts = await prisma.matchingDonationLog.groupBy({
    by: ['donorId'],
    where: {
      donorId: { in: donorIds },
    },
    _sum: {
      matchedAmount: true,
    },
  })

  // Convert the result to a map for easy lookup
  const donorMatchedAmountMap = new Map<string, number>()
  matchedAmounts.forEach((item) => {
    // Check if _sum.matchedAmount exists and convert to number
    const matchedAmount = item._sum.matchedAmount
      ? item._sum.matchedAmount.toNumber()
      : 0
    donorMatchedAmountMap.set(item.donorId, matchedAmount)
  })

  return donorMatchedAmountMap
}
export default prisma
