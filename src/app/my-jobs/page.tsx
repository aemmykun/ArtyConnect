import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { JobCard } from "../jobs/job-card"

export default async function MyJobsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Get ONLY jobs assigned to the current user
    const { data: jobs } = await supabase
        .from("jobs")
        .select("*, properties(name, address)")
        .eq("assigned_to", user.id)
        .order("scheduled_date", { ascending: true })

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Jobs</h1>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs?.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-muted)' }}>You have no assigned jobs.</p>
                    </div>
                ) : (
                    jobs?.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))
                )}
            </div>
        </div>
    )
}
