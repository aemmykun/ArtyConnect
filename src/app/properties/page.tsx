import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AddPropertyForm } from "./add-property-form"
import { checkSubscription } from "@/lib/subscription"

export default async function PropertiesPage() {
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

    // 1. Get properties (RLS handles filtering by org)
    const { data: properties } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Properties</h1>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {properties?.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No properties found. Add your first one!</p>
                        </div>
                    ) : (
                        properties?.map((prop) => (
                            <div key={prop.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{prop.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{prop.address || "No address provided"}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Form */}
                <div>
                    <AddPropertyForm />
                </div>
            </div>
        </div>
    )
}
