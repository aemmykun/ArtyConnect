import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

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
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(to right, var(--primary), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ArtyConnect
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>{org.name}</span>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
          <span>{user.email}</span>
          <form action={signOut}>
            <button className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main>
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Welcome to the <strong>{org.name}</strong> workspace.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>My Role</h3>
              <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize' }}>
                {membership.role}
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Organization ID</h3>
              <code style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{org.id}</code>
            </div>
          </div>

          <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Common Link for Everyone */}
            <Link href="/my-jobs" className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit', border: '1px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>My Jobs</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View your assigned tasks</p>
            </Link>

            {/* Manager/Owner Links */}
            {['owner', 'manager'].includes(membership.role) && (
              <>
                <Link href="/properties" className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Properties</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage houses</p>
                </Link>

                <Link href="/rooms" className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Rooms</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage units & status</p>
                </Link>

                <Link href="/jobs" className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>All Jobs</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Schedule cleaning tasks</p>
                </Link>

                <Link href="/billing" className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Billing</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage subscription</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
