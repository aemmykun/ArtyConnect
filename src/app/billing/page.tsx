import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import styles from "./billing.module.css"

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
        <div className={`container ${styles.pageContainer}`}>
            <header className={styles.header}>
                <div>
                    <Link href="/" className={styles.backLink}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className={styles.pageTitle}>Billing & Subscription</h1>
                </div>
            </header>

            {/* Error Banner */}
            {org.subscription_status !== 'active' && (
                <div className={styles.errorBanner}>
                    <strong>Subscription Required:</strong> Please activate your subscription to access PMS features.
                </div>
            )}

            <div className={styles.contentGrid}>

                {/* Plan Details */}
                <div className="card">
                    <h2 className={styles.cardTitle}>Current Plan</h2>

                    <div className={styles.detailsList}>
                        <div className={styles.planInfo}>
                            <div className={styles.planHeader}>
                                <h3 className={styles.planName}>ArtyConnect Platform</h3>
                                <span className={styles.planBadge}>
                                    STANDARD
                                </span>
                            </div>
                            <p className={styles.planDescription}>
                                Full access to housekeeping management features.
                            </p>
                        </div>

                        <div>
                            <h3 className={styles.sectionTitle}>Pricing Breakdown</h3>
                            <ul className={styles.pricingList}>
                                <li className={styles.pricingItem}>
                                    <span>Integration Setup Fee (One-time)</span>
                                    <strong>AU$1,500.00</strong>
                                </li>
                                <li className={styles.pricingItem}>
                                    <span>Subscription Rate</span>
                                    <strong>AU$3.50 / room / month</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Summary / Action */}
                <div className={`card ${styles.summaryCard}`}>
                    <h2 className={styles.summaryTitle}>Estimated Costs</h2>

                    <div className={styles.costBreakdown}>
                        <div className={styles.costItem}>
                            <span className={styles.costLabel}>Active Rooms</span>
                            <span>{propertyCount}</span>
                        </div>
                        <div className={styles.totalItem}>
                            <span>Monthly Total</span>
                            <span>AU${estimatedMonthly.toFixed(2)}</span>
                        </div>
                    </div>

                    <button className={`btn btn-primary ${styles.actionButton}`}>
                        Manage Subscription
                    </button>
                    <p className={styles.footerNote}>
                        Payments are processed securely via Stripe.
                    </p>
                </div>

            </div>
        </div>
    )
}
