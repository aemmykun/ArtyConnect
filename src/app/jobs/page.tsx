import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AddJobForm } from "./add-job-form"
import { JobCard } from "./job-card"
import { checkSubscription } from "@/lib/subscription"

export default async function JobsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Get Org ID
    const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single()

    if (!membership) redirect("/onboarding")

    // Check Subscription
    const hasAccess = await checkSubscription(membership.organization_id)
    if (!hasAccess) {
        redirect("/billing?error=subscription_required")
    }

    // 1. Get Jobs (with property details)
    const { data: jobs } = await supabase
        .from("jobs")
        .select("*, properties(name, address)")
        .order("scheduled_date", { ascending: true })

    // 2. Get Properties (for the add form)
    const { data: properties } = await supabase
        .from("properties")
        .select("id, name")
        .order("name")

    // 3. Get Members (for assignment)
    const { data: members } = await supabase
        .from("organization_members")
        .select("user_id, role, profiles(full_name, email)")

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Jobs</h1>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {jobs?.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No jobs scheduled. Create one!</p>
                        </div>
                    ) : (
                        jobs?.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))
                    )}
                </div>

                {/* Add Form */}
                <div>
                    <AddJobForm properties={properties || []} members={members || []} />
                </div>
            </div>
        </div>
    )
}
