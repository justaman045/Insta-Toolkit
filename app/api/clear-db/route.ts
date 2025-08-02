import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId, tables } = await req.json()

    if (!userId || !Array.isArray(tables)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    for (const table of tables) {
      switch (table) {
        case 'followers':
          await prisma.follower.deleteMany({ where: { userId } })
          break
        case 'following':
          await prisma.following.deleteMany({ where: { userId } })
          break
        case 'nonFollowers':
          await prisma.nonFollower.deleteMany({ where: { userId } })
          break
        case 'pendingRequests':
          await prisma.pendingRequest.deleteMany({ where: { userId } })
          break
        default:
          console.warn(`Unknown table: ${table}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CLEAR DB API ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
