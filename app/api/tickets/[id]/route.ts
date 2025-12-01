import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { TicketStatus as TicketStatusType } from '@/app/generated/prisma/enums'

function resolveIdFrom(req: NextRequest, params?: { id?: string }) {
  if (params?.id) return params.id
  try {
    const url = new URL(req.url)
    const segments = url.pathname.split('/').filter(Boolean)
    return segments[segments.length - 1]
  } catch {
    return undefined
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = resolveIdFrom(_req, params)
    if (!id) return NextResponse.json({ error: 'Missing ticket id' }, { status: 400 })

    const ticket = await prisma.ticket.findUnique({ where: { id } })
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 })
  }
}

const VALID_STATUSES = ['Pending', 'Doing', 'Reviewing', 'Completed'] as const

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const data: Partial<{ title: string; description: string; status: TicketStatusType }> = {}
    const id = resolveIdFrom(_req, params)
    if (!id) return NextResponse.json({ error: 'Missing ticket id' }, { status: 400 })

    await prisma.ticket.delete({ where: { id } })
    const ticket = await prisma.ticket.update({ where: { id: params.id }, data })
    return NextResponse.json(ticket)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}
