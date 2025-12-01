"use client"

import React, { useEffect, useState } from 'react'

type Ticket = {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [status, setStatus] = useState('Pending')

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tickets')
      const data = await res.json()
      setTickets(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const createTicket = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!title.trim()) return
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), description, status }),
    })
    const t = await res.json()
    setTitle('')
    setDescription('')
    setStatus('Pending')
    setTickets(prev => [t, ...prev])
  }

  const deleteTicket = async (id: string) => {
    await fetch(`/api/tickets/${id}`, { method: 'DELETE' })
    setTickets(prev => prev.filter(t => t.id !== id))
  }

  const startEdit = (t: Ticket) => {
    setEditingId(t.id)
    setTitle(t.title)
    setDescription(t.description)
    setStatus(t.status)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setStatus('Pending')
  }

  const saveEdit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!editingId) return
    const res = await fetch(`/api/tickets/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status }),
    })
    const updated = await res.json()
    setTickets(prev => prev.map(p => (p.id === updated.id ? updated : p)))
    cancelEdit()
  }

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Tickets</h1>

      <form onSubmit={editingId ? saveEdit : createTicket} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: 8 }}>
            <option>Pending</option>
            <option>Doing</option>
            <option>Reviewing</option>
            <option>Completed</option>
          </select>
          <button type="submit" style={{ padding: '8px 12px' }}>{editingId ? 'Save' : 'Create'}</button>
          {editingId && (
            <button type="button" onClick={cancelEdit} style={{ padding: '8px 12px' }}>Cancel</button>
          )}
        </div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: '100%', padding: 8, minHeight: 80 }}
        />
      </form>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tickets.map(t => (
            <li key={t.id} style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{t.title}</strong>
                  <div style={{ color: '#666', fontSize: 12 }}>{new Date(t.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ padding: '4px 8px', background: '#f3f3f3', borderRadius: 6 }}>{t.status}</div>
                  <button onClick={() => startEdit(t)}>Edit</button>
                  <button onClick={() => deleteTicket(t.id)}>Delete</button>
                </div>
              </div>
              {t.description && <p style={{ marginTop: 8 }}>{t.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

