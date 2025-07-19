// app/api/followers/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId, followers } = await req.json()

    if (!userId || !Array.isArray(followers)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // 1. Get latest batch for comparison
    const latestBatch = await prisma.follower.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    })

    const previousSet = new Set(latestBatch.map(f => f.username))
    const currentSet = new Set(followers.map((f: any) => f.username))

    const isSame =
      previousSet.size === currentSet.size &&
      [...previousSet].every(username => currentSet.has(username))

    if (isSame) {
      return NextResponse.json({ message: 'No changes detected, skipping update.' })
    }

    // 2. Compute next batch number
    const latest = await prisma.follower.findFirst({
      where: { userId },
      orderBy: { uploadBatch: 'desc' },
    })
    const nextBatch = latest ? latest.uploadBatch + 1 : 1
    const uploadedAt = new Date()

    // 3. Insert only if different
    await prisma.follower.createMany({
      data: followers.map((f: any) => ({
        username: f.username,
        href: f.href,
        followedAt: f.followedAt,
        userId,
        uploadBatch: nextBatch,
        uploadedAt,
      })),
    })

    return NextResponse.json({ success: true, added: followers.length, batch: nextBatch })
  } catch (error) {
    console.error('[API FOLLOWERS POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
