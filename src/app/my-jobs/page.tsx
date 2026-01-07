import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobCard } from "../jobs/job-card";
import styles from "./page.module.css";

export default async function MyJobsPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get ONLY jobs assigned to the current user
    const { data: jobs } = await supabase
        .from("jobs")
        .select("*, properties(name, address)")
        .eq("assigned_to", user.id)
        .order("scheduled_date", { ascending: true });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <Link href="/" className={styles.backLink}>
                        &larr; Back to Dashboard
                    </Link>
                    <h1 className={styles.title}>My Jobs</h1>
                </div>
            </header>

            <div className={styles.jobsContainer}>
                {jobs?.length === 0 ? (
                    <div className={styles.emptyCard}>
                        <p className={styles.emptyText}>You have no assigned jobs.</p>
                    </div>
                ) : (
                    jobs?.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))
                )}
            </div>
        </div>
    );
}
