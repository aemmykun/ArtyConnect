import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AddRoomForm } from "./add-room-form"
import { checkSubscription } from "@/lib/subscription"

export default async function RoomsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Get Org ID
    const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id, role")
        .eq("user_id", user.id)
        .single()

    if (!membership) redirect("/onboarding")

    // Check Subscription
    const hasAccess = await checkSubscription(membership.organization_id)
    if (!hasAccess) {
        redirect("/billing?error=subscription_required")
    }

    // 1. Get Rooms (with property name)
    const { data: rooms } = await supabase
        .from("rooms")
        .select("*, properties(name)")
        .order("created_at", { ascending: false })

    // 2. Get Properties (for the add form)
    const { data: properties } = await supabase
        .from("properties")
        .select("id, name")
        .order("name")

    const isManager = ['owner', 'manager'].includes(membership.role)

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rooms</h1>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: isManager ? '1fr 350px' : '1fr', gap: '2rem' }}>
                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {rooms?.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No rooms found.</p>
                        </div>
                    ) : (
                        rooms?.map((room) => (
                            <div key={room.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{room.name}</h3>
                                        <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', borderRadius: '999px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                            {room.properties?.name}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {room.type} • Floor {room.floor} • {room.section}
                                    </p>
                                </div>
                                <div>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        background: room.status === 'clean' ? 'rgba(34, 197, 94, 0.1)' :
                                            room.status === 'dirty' ? 'rgba(239, 68, 68, 0.1)' :
                                                room.status === 'inspected' ? 'rgba(99, 102, 241, 0.1)' : 'var(--surface)',
                                        color: room.status === 'clean' ? '#22c55e' :
                                            room.status === 'dirty' ? '#ef4444' :
                                                room.status === 'inspected' ? 'var(--primary)' : 'var(--text-muted)'
                                    }}>
                                        {room.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Form (Managers Only) */}
                {isManager && (
                    <div>
                        <AddRoomForm properties={properties || []} />
                    </div>
                )}
            </div>
        </div>
    )
}
