import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(tickets)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, status } = body
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description: description ?? '',
        status: status ?? 'Pending',
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
