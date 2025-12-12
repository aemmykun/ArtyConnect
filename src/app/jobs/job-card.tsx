"use client"

import { updateJobStatus } from "../actions"
import { useState } from "react"

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

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'completed': return '#22c55e';
            case 'in_progress': return '#3b82f6';
            case 'cancelled': return '#ef4444';
            default: return '#eab308';
        }
    }

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{job.properties.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{job.properties.address}</p>
                </div>
                <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    background: `${getStatusColor(status)}20`,
                    color: getStatusColor(status)
                }}>
                    {status.replace('_', ' ')}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span>📅 {new Date(job.scheduled_date).toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {status === 'pending' && (
                    <button
                        onClick={() => handleStatusChange('in_progress')}
                        disabled={loading}
                        className="btn"
                        style={{ flex: 1, background: '#3b82f6', color: 'white', fontSize: '0.875rem' }}
                    >
                        Start Job
                    </button>
                )}
                {status === 'in_progress' && (
                    <button
                        onClick={() => handleStatusChange('completed')}
                        disabled={loading}
                        className="btn"
                        style={{ flex: 1, background: '#22c55e', color: 'white', fontSize: '0.875rem' }}
                    >
                        Complete
                    </button>
                )}
                {status !== 'cancelled' && status !== 'completed' && (
                    <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={loading}
                        className="btn"
                        style={{ background: '#fee2e2', color: '#ef4444', fontSize: '0.875rem' }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    )
}
