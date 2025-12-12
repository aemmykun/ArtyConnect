"use client"

import { createRoom } from "../actions"
import { useState } from "react"

export function AddRoomForm({ properties }: { properties: { id: string, name: string }[] }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError("")
        setSuccess(false)

        const result = await createRoom(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess(true)
            // Reset form
            const form = document.getElementById("add-room-form") as HTMLFormElement
            form?.reset()
        }
        setLoading(false)
    }

    if (properties.length === 0) {
        return (
            <div className="card">
                <p style={{ color: 'var(--text-muted)' }}>You need to add a property first.</p>
            </div>
        )
    }

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add New Room</h2>

            <form id="add-room-form" action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {error && (
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}
                {success && (
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', fontSize: '0.875rem' }}>
                        Room added successfully!
                    </div>
                )}

                <div>
                    <label htmlFor="property_id" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Property
                    </label>
                    <select id="property_id" name="property_id" className="input" required>
                        <option value="">Select a property...</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Room Number / Name
                    </label>
                    <input id="name" name="name" type="text" className="input" placeholder="e.g. 305" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="type" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                            Type
                        </label>
                        <input id="type" name="type" type="text" className="input" placeholder="e.g. 1BR" />
                    </div>
                    <div>
                        <label htmlFor="floor" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                            Floor
                        </label>
                        <input id="floor" name="floor" type="number" className="input" placeholder="e.g. 3" />
                    </div>
                </div>

                <div>
                    <label htmlFor="section" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Section / Wing
                    </label>
                    <input id="section" name="section" type="text" className="input" placeholder="e.g. East Wing" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Room'}
                </button>
            </form>
        </div>
    )
}
