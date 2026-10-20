"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await authClient.signIn.email({
            email: email.trim(),
            password,
          });

      if (result.error) {
        setError(
          isSignUp
            ? "Signup failed. Check your details or try logging in."
            : "Login failed. Check your email and password.",
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Cannot connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-emerald-500";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <p className="font-semibold tracking-widest text-emerald-400">
          CAREERPILOT
        </p>

        <h1 className="mt-5 text-3xl font-bold">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Your job search workspace starts here.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {isSignUp && (
            <label className="block text-sm">
              Full name
              <input
                className={inputClass}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                disabled={loading}
              />
            </label>
          )}

          <label className="block text-sm">
            Email
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              maxLength={254}
              disabled={loading}
            />
          </label>

          <label className="block text-sm">
            Password
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                isSignUp ? "new-password" : "current-password"
              }
              required
              minLength={isSignUp ? 12 : 1}
              maxLength={128}
              disabled={loading}
            />
          </label>

          {isSignUp && (
            <p className="text-xs text-slate-400">
              Use a unique password of at least 12 characters.
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 p-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignUp
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setPassword("");
          }}
          className="mt-6 text-sm text-emerald-400"
        >
          {isSignUp
            ? "Already have an account? Log in"
            : "New here? Create an account"}
        </button>
      </section>
    </main>
  );
}