"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error("Logout failed.");
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Logout failed. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={logout}
        disabled={loading}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Log out"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}