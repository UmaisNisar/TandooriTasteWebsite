"use client";

import { useState } from "react";

export default function ResetAdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/reset-admin", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to reset admin user");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-section max-w-md">
        <div className="card-surface p-6 sm:p-8">
          <h1 className="font-heading text-2xl text-gold mb-4">
            Reset Admin User
          </h1>
          <p className="text-sm text-gray-300 mb-6">
            This will delete and recreate the admin user with default credentials.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-500/20 border border-red-500/50 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {result && (
            <div className="mb-4 rounded-md bg-green-500/20 border border-green-500/50 px-3 py-2 text-sm text-green-200">
              <p className="font-semibold">✅ {result.message}</p>
              <p className="mt-2">Email: {result.credentials.email}</p>
              <p>Password: {result.credentials.password}</p>
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Admin User"}
          </button>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">Quick Links:</p>
            <a
              href="/api/check-user"
              target="_blank"
              className="text-xs text-gold hover:underline block mb-1"
            >
              Check Users (opens in new tab)
            </a>
            <a
              href="/admin/login"
              className="text-xs text-gold hover:underline block"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

