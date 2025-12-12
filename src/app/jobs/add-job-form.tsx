"use client"

import { createJob } from "../actions"
import { useState, useRef } from "react"

export function AddJobForm({ properties, members }: { properties: any[], members: any[] }) {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError("")

        const result = await createJob(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            formRef.current?.reset()
        }
        setLoading(false)
    }

    return (
        <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Schedule Job</h2>
            <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {error && (
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="property_id" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Property
                    </label>
                    <select
                        id="property_id"
                        name="property_id"
                        className="input"
                        required
                    >
                        <option value="">Select a property...</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="assigned_to" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Assign To (Optional)
                    </label>
                    <select
                        id="assigned_to"
                        name="assigned_to"
                        className="input"
                    >
                        <option value="">Unassigned</option>
                        {members.map(m => (
                            <option key={m.user_id} value={m.user_id}>
                                {m.profiles?.full_name || m.profiles?.email || "Unknown User"} ({m.role})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="scheduled_date" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Date & Time
                    </label>
                    <input
                        id="scheduled_date"
                        name="scheduled_date"
                        type="datetime-local"
                        className="input"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Scheduling...' : 'Schedule Job'}
                </button>
            </form>
        </div>
    )
}
