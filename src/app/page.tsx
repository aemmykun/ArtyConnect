import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import styles from "./dashboard.module.css"

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch Organization Membership
  const { data: membership } = await supabase
    .from("organization_members")
    .select("*, organizations(*)")
    .eq("user_id", user.id)
    .single()

  if (!membership) {
    redirect("/onboarding")
  }

  const org = membership.organizations

  const signOut = async () => {
    "use server"
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    redirect("/login")
  }

  return (
    <div className={`container ${styles.container}`}>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          ArtyConnect
        </h1>

        <div className={styles.userInfo}>
          <span className={styles.orgName}>{org.name}</span>
          <div className={styles.divider}></div>
          <span>{user.email}</span>
          <form action={signOut}>
            <button className={`btn ${styles.signOutButton}`}>
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main>
        <div className="card">
          <h2 className={styles.dashboardTitle}>Dashboard</h2>
          <p className={styles.dashboardDescription}>
            Welcome to the <strong>{org.name}</strong> workspace.
          </p>

          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}>My Role</h3>
              <div className={styles.roleBadge}>
                {membership.role}
              </div>
            </div>

            <div className={styles.statCard}>
              <h3 className={styles.statTitle}>Organization ID</h3>
              <code className={styles.orgId}>{org.id}</code>
            </div>
          </div>

          <div className={styles.linkGrid}>
            {/* Common Link for Everyone */}
            <Link href="/my-jobs" className={`card ${styles.actionCard} ${styles.primaryAction}`}>
              <h3 className={`${styles.cardTitle} ${styles.primaryActionTitle}`}>My Jobs</h3>
              <p className={styles.cardDescription}>View your assigned tasks</p>
            </Link>

            {/* Manager/Owner Links */}
            {['owner', 'manager'].includes(membership.role) && (
              <>
                <Link href="/properties" className={`card ${styles.actionCard}`}>
                  <h3 className={styles.cardTitle}>Properties</h3>
                  <p className={styles.cardDescription}>Manage houses</p>
                </Link>

                <Link href="/rooms" className={`card ${styles.actionCard}`}>
                  <h3 className={styles.cardTitle}>Rooms</h3>
                  <p className={styles.cardDescription}>Manage units & status</p>
                </Link>

                <Link href="/jobs" className={`card ${styles.actionCard}`}>
                  <h3 className={styles.cardTitle}>All Jobs</h3>
                  <p className={styles.cardDescription}>Schedule cleaning tasks</p>
                </Link>

                <Link href="/billing" className={`card ${styles.actionCard}`}>
                  <h3 className={styles.cardTitle}>Billing</h3>
                  <p className={styles.cardDescription}>Manage subscription</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
