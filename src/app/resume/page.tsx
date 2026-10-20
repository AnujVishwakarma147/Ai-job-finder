"use client";

import { useState } from "react";
import {
  resumeProfileSchema,
  type ResumeProfile,
} from "@/lib/resume-schema";

export default function ResumePage() {
  const [text, setText] = useState("");
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeResume() {
    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Resume analysis failed.");
      }

      const parsed = resumeProfileSchema.safeParse(data.profile);

      if (!parsed.success) {
        throw new Error("Received an invalid profile.");
      }

      setProfile(parsed.data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold tracking-widest text-emerald-400">
          CAREERPILOT
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Understand your resume
        </h1>

        <p className="mt-3 text-slate-400">
          Analyze your resume using Ollama running on your machine.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <label
            htmlFor="resume-text"
            className="mb-3 block font-medium"
          >
            Paste your resume text
          </label>

          <textarea
            id="resume-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={12000}
            disabled={loading}
            rows={14}
            placeholder="Paste your name, skills, education and projects..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-7 outline-none focus:border-emerald-500 disabled:opacity-60"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm text-slate-400">
              {text.length.toLocaleString()} / 12,000 characters
            </span>

            <button
              onClick={analyzeResume}
              disabled={loading || text.trim().length < 100}
              className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze resume"}
            </button>
          </div>

          {loading && (
            <p role="status" className="mt-4 text-sm text-amber-300">
              Local analysis is running. The first request may take
              longer while the model loads.
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-red-950 p-4 text-sm text-red-200"
            >
              {error}
            </p>
          )}
        </section>

        {profile && (
          <section className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div>
              <p className="text-sm text-amber-300">
                AI-extracted profile — review all facts.
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {profile.name || "Name not found"}
              </h2>

              <p className="mt-2 text-emerald-400">
                {profile.headline}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {profile.email}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Summary</h3>
              <p className="mt-2 leading-7 text-slate-300">
                {profile.summary || "No summary extracted."}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Skills</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-emerald-950 px-3 py-1 text-sm text-emerald-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Education</h3>

              {profile.education.length === 0 && (
                <p className="mt-2 text-slate-400">
                  No education extracted.
                </p>
              )}

              {profile.education.map((item, index) => (
                <p key={index} className="mt-2 text-slate-300">
                  {item}
                </p>
              ))}
            </div>

            <div>
              <h3 className="font-semibold">Projects</h3>

              {profile.projects.length === 0 && (
                <p className="mt-2 text-slate-400">
                  No projects extracted.
                </p>
              )}

              {profile.projects.map((project, index) => (
                <article
                  key={index}
                  className="mt-3 rounded-xl border border-slate-700 p-4"
                >
                  <h4 className="font-medium">{project.name}</h4>

                  <p className="mt-2 leading-7 text-slate-300">
                    {project.description}
                  </p>

                  <p className="mt-2 text-sm text-emerald-400">
                    {project.technologies.join(" · ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}