"use client"

import { createProperty } from "../actions"
import { useState, useRef } from "react"

export function AddPropertyForm() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError("")

        const result = await createProperty(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            formRef.current?.reset()
        }
        setLoading(false)
    }

    return (
        <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Property</h2>
            <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {error && (
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Property Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="input"
                        placeholder="e.g. Seaside Villa"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="address" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        Address
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        className="input"
                        placeholder="123 Ocean Dr"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Property'}
                </button>
            </form>
        </div>
    )
}
