import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId, following } = await req.json()

    if (!userId || !Array.isArray(following)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Get the last batch number
    const last = await prisma.following.findFirst({
      where: { userId },
      orderBy: { uploadBatch: 'desc' },
    })
    const nextBatch = last ? last.uploadBatch + 1 : 1

    await prisma.following.createMany({
      data: following.map((f: any) => ({
        username: f.username,
        href: f.href,
        followedAt: f.followedAt,
        userId,
        uploadBatch: nextBatch,
      })),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API FOLLOWING POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}