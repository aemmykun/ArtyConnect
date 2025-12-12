"use client"

import { createOrganization } from "../actions"
import { useState } from "react"

export default function OnboardingPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError("")

        const result = await createOrganization(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // If success, the server action handles redirect
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Setup Your Organization
                </h1>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    Create a new workspace for your housekeeping team.
                </p>

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && (
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem' }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                            Organization Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="input"
                            placeholder="e.g. Arty's Cleaning Co."
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Creating...' : 'Create Organization'}
                    </button>
                </form>
            </div>
        </div>
    )
}
