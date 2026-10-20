import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

async function DashboardContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <span className="text-xl font-bold text-emerald-400">
            CareerPilot
          </span>

          <LogoutButton />
        </header>

        <h1 className="mt-10 text-3xl font-bold">
          Welcome, {session.user.name}
        </h1>

        <p className="mt-3 text-slate-400">
          You are logged in as {session.user.email}.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Start with your resume
          </h2>

          <p className="mt-3 text-slate-400">
            Extract your skills and experience using local AI.
          </p>

          <Link
            href="/resume"
            className="mt-5 inline-block rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
          >
            Analyze resume
          </Link>
        </section>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <p className="p-10">
          Loading your workspace...
        </p>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}