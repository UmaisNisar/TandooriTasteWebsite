"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      console.log("[LOGIN] Attempting sign in with email:", email);
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false
      });

      console.log("[LOGIN] Sign in result:", result);

      if (result?.error) {
        console.error("[LOGIN] Sign in error:", result.error);
        setError(`Login failed: ${result.error}. Please try again.`);
        setLoading(false);
      } else if (result?.ok) {
        console.log("[LOGIN] Sign in successful, redirecting...");
        // Use window.location for a hard redirect to ensure session is recognized
        // This ensures the middleware sees the new session
        window.location.href = callbackUrl;
      } else {
        console.log("[LOGIN] Unexpected result:", result);
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("[LOGIN] Exception during sign in:", err);
      setError(`An error occurred: ${err instanceof Error ? err.message : "Unknown error"}`);
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-section max-w-md">
        <div className="card-surface p-6 sm:p-8">
          <h1 className="font-heading text-2xl text-gold mb-4">
            Admin Sign In
          </h1>
          <p className="text-sm text-gray-300 mb-6">
            Sign in with your admin credentials to access the admin panel.
            Only users with admin privileges can access this area.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-500/20 border border-red-500/50 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold text-gold">
                Username / Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                disabled={loading}
                className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-gold"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  className="h-10 w-full rounded-md border border-white/15 bg-black/40 px-3 pr-10 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Your secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 01-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="section-padding">
        <div className="container-section max-w-md">
          <div className="card-surface p-6 sm:p-8">
            <h1 className="font-heading text-2xl text-gold mb-4">
              Admin Sign In
            </h1>
            <p className="text-sm text-gray-300 mb-6">
              Loading...
            </p>
          </div>
        </div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}


