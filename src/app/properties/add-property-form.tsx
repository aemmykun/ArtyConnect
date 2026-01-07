"use client"

import { createProperty } from "../actions"
import { useState, useRef } from "react"
import styles from "./add-property-form.module.css"

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
        <div className={`card ${styles.formContainer}`}>
            <h2 className={styles.title}>Add Property</h2>
            <form ref={formRef} action={handleSubmit} className={styles.form}>
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}
                <div>
                    <label htmlFor="name" className={styles.label}>
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
                    <label htmlFor="address" className={styles.label}>
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
