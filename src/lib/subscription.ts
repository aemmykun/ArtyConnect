import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function checkSubscription(orgId: string) {
    const supabase = await createServerSupabaseClient()

    const { data: org } = await supabase
        .from("organizations")
        .select("subscription_status")
        .eq("id", orgId)
        .single()

    // For now, we'll assume 'active' or 'trialing' is valid.
    // Since we haven't integrated Stripe yet, we might manually set this in DB for testing.
    // If status is null (default from migration was 'incomplete'), they need to pay.

    // ALLOW 'incomplete' FOR NOW TO LET YOU TEST, BUT LOGIC IS HERE.
    // Change this to !== 'active' to enforce strict gating.
    const isValid = org?.subscription_status === 'active' || org?.subscription_status === 'incomplete'

    return isValid
}
