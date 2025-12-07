"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-charcoal/90 backdrop-blur-md">
      <nav className="container-section flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-gold text-lg font-bold text-white shadow-soft">
            TT
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-lg tracking-wide text-gold">
              Tandoori Tastes
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-300">
              Sudbury · Pakistani · Indian
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-200 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-200 transition-colors hover:text-gold"
              >
                Admin Panel
              </Link>
            )}
          </div>
          <Link
            href="/menu"
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-soft transition hover:bg-white"
          >
            View Menu
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-gray-100 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Open menu</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition-transform ${
                open ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-3.5 rounded-full bg-white transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-white transition-transform ${
                open ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-black/95 md:hidden">
          <div className="container-section flex flex-col gap-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/menu"
              className="mt-1 rounded-full bg-gold px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
              onClick={() => setOpen(false)}
            >
              View Menu
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


