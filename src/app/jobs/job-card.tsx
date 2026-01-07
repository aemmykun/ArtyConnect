"use client"

import { updateJobStatus } from "../actions"
import { useState } from "react"
import styles from "./job-card.module.css"

export function JobCard({ job }: { job: any }) {
    const [status, setStatus] = useState(job.status)
    const [loading, setLoading] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true)
        const result = await updateJobStatus(job.id, newStatus)
        if (result?.success) {
            setStatus(newStatus)
        }
        setLoading(false)
    }

    return (
        <div className={`card ${styles.cardLayout}`}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>{job.properties.name}</h3>
                    <p className={styles.subtitle}>{job.properties.address}</p>
                </div>
                <div className={`${styles.badge} ${styles[`status_${status}`] || styles.status_pending}`}>
                    {status.replace('_', ' ')}
                </div>
            </div>

            <div className={styles.details}>
                <span>📅 {new Date(job.scheduled_date).toLocaleString()}</span>
            </div>

            <div className={styles.footerActions}>
                {status === 'pending' && (
                    <button
                        onClick={() => handleStatusChange('in_progress')}
                        disabled={loading}
                        className={`btn ${styles.actionButton} ${styles.startButton}`}
                    >
                        Start Job
                    </button>
                )}
                {status === 'in_progress' && (
                    <button
                        onClick={() => handleStatusChange('completed')}
                        disabled={loading}
                        className={`btn ${styles.actionButton} ${styles.completeButton}`}
                    >
                        Complete
                    </button>
                )}
                {status !== 'cancelled' && status !== 'completed' && (
                    <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={loading}
                        className={`btn ${styles.cancelButton}`}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    )
}
