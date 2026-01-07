"use client"

import { createOrganization } from "../actions"
import { useState } from "react"
import styles from "./onboarding.module.css"

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
        <div className={styles.container}>
            <div className={`card ${styles.card}`}>
                <h1 className={styles.title}>
                    Setup Your Organization
                </h1>
                <p className={styles.description}>
                    Create a new workspace for your housekeeping team.
                </p>

                <form action={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className={styles.label}>
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

                    <button type="submit" className={`btn btn-primary ${styles.submitButton}`} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Organization'}
                    </button>
                </form>
            </div>
        </div>
    )
}
