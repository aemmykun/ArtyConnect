"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// ... existing createOrganization ...

export async function createOrganization(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const name = formData.get("name") as string
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    if (!name) {
        return { error: "Organization name is required" }
    }

    // 1. Create Organization
    const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({ name, slug })
        .select()
        .single()

    if (orgError) {
        return { error: orgError.message }
    }

    // 2. Add User as Owner
    const { error: memberError } = await supabase
        .from("organization_members")
        .insert({
            organization_id: org.id,
            user_id: user.id,
            role: "owner"
        })

    if (memberError) {
        // Cleanup org if member creation fails (optional but good practice)
        await supabase.from("organizations").delete().eq("id", org.id)
        return { error: memberError.message }
    }

    revalidatePath("/")
    redirect("/")
}

export async function createProperty(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Not authenticated" }
    }

    const name = formData.get("name") as string
    const address = formData.get("address") as string

    if (!name) {
        return { error: "Property name is required" }
    }

    // Get user's organization
    const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single()

    if (!membership) {
        return { error: "No organization found" }
    }

    const { error } = await supabase
        .from("properties")
        .insert({
            name,
            address,
            organization_id: membership.organization_id
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/properties")
    return { success: true }
}

export async function createJob(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Not authenticated" }
    }

    const propertyId = formData.get("property_id") as string
    const scheduledDate = formData.get("scheduled_date") as string
    const assignedTo = formData.get("assigned_to") as string || null

    if (!propertyId || !scheduledDate) {
        return { error: "Property and Date are required" }
    }

    // Get user's organization
    const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single()

    if (!membership) {
        return { error: "No organization found" }
    }

    const { error } = await supabase
        .from("jobs")
        .insert({
            property_id: propertyId,
            organization_id: membership.organization_id,
            scheduled_date: new Date(scheduledDate).toISOString(),
            assigned_to: assignedTo,
            status: 'pending'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/jobs")
    return { success: true }
}

export async function updateJobStatus(jobId: string, status: string) {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
        .from("jobs")
        .update({ status })
        .eq("id", jobId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/jobs")
    return { success: true }
}

export async function createRoom(formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Not authenticated" }
    }

    const propertyId = formData.get("property_id") as string
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const floor = formData.get("floor") as string
    const section = formData.get("section") as string

    if (!propertyId || !name) {
        return { error: "Property and Room Name are required" }
    }

    // Get user's organization
    const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .single()

    if (!membership) {
        return { error: "No organization found" }
    }

    const { error } = await supabase
        .from("rooms")
        .insert({
            organization_id: membership.organization_id,
            property_id: propertyId,
            name,
            type,
            floor: floor ? parseInt(floor) : null,
            section,
            status: 'dirty' // Default status
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/rooms")
    return { success: true }
}
