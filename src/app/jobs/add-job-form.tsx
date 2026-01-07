"use client"

import { createJob } from "../actions"
import { useState, useRef } from "react"
import styles from "./add-job-form.module.css"

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
        <div className={`card ${styles.formCard}`}>
            <h2 className={styles.title}>Schedule Job</h2>
            <form ref={formRef} action={handleSubmit} className={styles.form}>
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="property_id" className={styles.label}>
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
                    <label htmlFor="assigned_to" className={styles.label}>
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
                    <label htmlFor="scheduled_date" className={styles.label}>
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
