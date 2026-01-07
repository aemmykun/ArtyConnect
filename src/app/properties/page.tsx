import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AddPropertyForm } from "./add-property-form"
import { checkSubscription } from "@/lib/subscription"
import styles from "./properties.module.css"

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
        <div className={`container ${styles.pageContainer}`}>
            <header className={styles.header}>
                <div>
                    <Link href="/" className={styles.backLink}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className={styles.title}>Properties</h1>
                </div>
            </header>

            <div className={styles.contentGrid}>
                {/* List */}
                <div className={styles.propertyList}>
                    {properties?.length === 0 ? (
                        <div className={`card ${styles.emptyState}`}>
                            <p className={styles.emptyText}>No properties found. Add your first one!</p>
                        </div>
                    ) : (
                        properties?.map((prop) => (
                            <div key={prop.id} className={`card ${styles.propertyCard}`}>
                                <div>
                                    <h3 className={styles.propertyName}>{prop.name}</h3>
                                    <p className={styles.propertyAddress}>{prop.address || "No address provided"}</p>
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
