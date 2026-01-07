import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { AddRoomForm } from "./add-room-form"
import { checkSubscription } from "@/lib/subscription"
import styles from "./rooms.module.css"

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
        <div className={`container ${styles.container}`}>
            <header className={styles.header}>
                <div>
                    <Link href="/" className={styles.backLink}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className={styles.title}>Rooms</h1>
                </div>
            </header>

            <div className={`${styles.grid} ${isManager ? styles.gridManager : styles.gridSingle}`}>
                {/* List */}
                <div className={styles.list}>
                    {rooms?.length === 0 ? (
                        <div className={`card ${styles.emptyState}`}>
                            <p className={styles.emptyText}>No rooms found.</p>
                        </div>
                    ) : (
                        rooms?.map((room) => (
                            <div key={room.id} className={`card ${styles.roomCard}`}>
                                <div>
                                    <div className={styles.roomHeader}>
                                        <h3 className={styles.roomName}>{room.name}</h3>
                                        <span className={styles.propertyName}>
                                            {room.properties?.name}
                                        </span>
                                    </div>
                                    <p className={styles.roomDetails}>
                                        {room.type} • Floor {room.floor} • {room.section}
                                    </p>
                                </div>
                                <div>
                                    <span className={`
                                        ${styles.statusBadge}
                                        ${room.status === 'clean' ? styles.statusClean :
                                            room.status === 'dirty' ? styles.statusDirty :
                                                room.status === 'inspected' ? styles.statusInspected : styles.statusDefault}
                                    `}>
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
