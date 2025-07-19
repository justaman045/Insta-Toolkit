// lib/getStats.ts

import { prisma } from '@/lib/prisma'

export async function getUserStats(userId: string) {
  const [followers, following, nonFollowers, pending] = await Promise.all([
    prisma.follower.count({ where: { userId } }),
    prisma.following.count({ where: { userId } }),
    prisma.nonFollower.count({ where: { userId } }),
    prisma.pendingRequest.count({ where: { userId } }),
  ])

  return { followers, following, nonFollowers, pending }
}
