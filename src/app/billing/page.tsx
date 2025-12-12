import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function BillingPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Get Organization
    const { data: membership } = await supabase
        .from("organization_members")
        .select("*, organizations(*)")
        .eq("user_id", user.id)
        .single()

    if (!membership) {
        redirect("/onboarding")
    }

    const org = membership.organizations

    // Get Property Count for estimation
    const { count } = await supabase
        .from("properties")
        .select("*", { count: 'exact', head: true })
        .eq("organization_id", org.id)

    const propertyCount = count || 0
    const estimatedMonthly = propertyCount * 3.50

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Billing & Subscription</h1>
                </div>
            </header>

            {/* Error Banner */}
            {org.subscription_status !== 'active' && (
                <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius)', border: '1px solid #fecaca' }}>
                    <strong>Subscription Required:</strong> Please activate your subscription to access PMS features.
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>

                {/* Plan Details */}
                <div className="card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Current Plan</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>ArtyConnect Platform</h3>
                                <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                                    STANDARD
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Full access to housekeeping management features.
                            </p>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Pricing Breakdown</h3>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Integration Setup Fee (One-time)</span>
                                    <strong>AU$1,500.00</strong>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>Subscription Rate</span>
                                    <strong>AU$3.50 / room / month</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Summary / Action */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Estimated Costs</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Active Rooms</span>
                            <span>{propertyCount}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 600, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                            <span>Monthly Total</span>
                            <span>AU${estimatedMonthly.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }}>
                        Manage Subscription
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                        Payments are processed securely via Stripe.
                    </p>
                </div>

            </div>
        </div>
    )
}
