import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Received data:', body)
    const { name, email, password } = body

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 })
    }

    const hashed = await hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    })

    return new Response(JSON.stringify({ message: 'User created' }), { status: 201 })
  } catch (err) {
    console.error("Register API error:", err)
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 })
  }
}
