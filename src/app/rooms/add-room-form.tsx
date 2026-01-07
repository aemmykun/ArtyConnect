"use client"

import { createRoom } from "../actions"
import { useState } from "react"
import styles from "./add-room-form.module.css"

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
                <p className={styles.emptyMessage}>You need to add a property first.</p>
            </div>
        )
    }

    return (
        <div className="card">
            <h2 className={styles.title}>Add New Room</h2>

            <form id="add-room-form" action={handleSubmit} className={styles.form}>
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className={styles.successMessage}>
                        Room added successfully!
                    </div>
                )}

                <div>
                    <label htmlFor="property_id" className={styles.label}>
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
                    <label htmlFor="name" className={styles.label}>
                        Room Number / Name
                    </label>
                    <input id="name" name="name" type="text" className="input" placeholder="e.g. 305" required />
                </div>

                <div className={styles.grid}>
                    <div>
                        <label htmlFor="type" className={styles.label}>
                            Type
                        </label>
                        <input id="type" name="type" type="text" className="input" placeholder="e.g. 1BR" />
                    </div>
                    <div>
                        <label htmlFor="floor" className={styles.label}>
                            Floor
                        </label>
                        <input id="floor" name="floor" type="number" className="input" placeholder="e.g. 3" />
                    </div>
                </div>

                <div>
                    <label htmlFor="section" className={styles.label}>
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
