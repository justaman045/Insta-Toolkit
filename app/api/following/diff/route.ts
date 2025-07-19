import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const latestBatch = await prisma.following.findFirst({
      where: { userId },
      orderBy: { uploadBatch: 'desc' },
      select: { uploadBatch: true },
    })

    if (!latestBatch) {
      return NextResponse.json({ previous: [] })
    }

    const previous = await prisma.following.findMany({
      where: {
        userId,
        uploadBatch: latestBatch.uploadBatch,
      },
    })

    return NextResponse.json({ previous })
  } catch (error) {
    console.error('[API FOLLOWING DIFF]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
