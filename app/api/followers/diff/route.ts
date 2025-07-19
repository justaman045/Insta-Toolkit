import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  try {
    const previous = await prisma.follower.findMany({
      where: { userId },
      select: { username: true },
    })

    return NextResponse.json({ previous })
  } catch (error) {
    console.error('[API FOLLOWERS DIFF]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
