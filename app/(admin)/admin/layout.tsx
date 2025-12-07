import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
  children
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session || role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-charcoal text-white">
      <div className="mx-auto flex h-full max-w-6xl flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black/70">
          <div className="p-4 border-b border-white/10">
            <p className="font-heading text-lg text-gold">Admin Panel</p>
            <p className="mt-1 text-[11px] text-gray-400">
              Signed in as {session.user?.email}
            </p>
          </div>
          <nav className="flex flex-row md:flex-col gap-2 p-4 text-sm overflow-x-auto md:overflow-visible">
            <Link
              href="/admin"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/menu"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Menu Items
            </Link>
            <Link
              href="/admin/categories"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Categories
            </Link>
            <div className="border-t border-white/10 my-2 md:block hidden" />
            <Link
              href="/admin/homepage"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Homepage
            </Link>
            <Link
              href="/admin/about"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              About Page
            </Link>
            <Link
              href="/admin/contact"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Contact Page
            </Link>
            <Link
              href="/admin/slider"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Home Slider
            </Link>
            <Link
              href="/admin/announcements"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Announcements
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Site Settings
            </Link>
            <Link
              href="/admin/store-settings"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Store Management
            </Link>
            <Link
              href="/admin/reviews"
              className="rounded-md px-3 py-2 text-gray-100 hover:bg-white/10 whitespace-nowrap"
            >
              Reviews
            </Link>
          </nav>
          <div className="mt-auto hidden md:block p-4">
            <LogoutButton className="w-full rounded-full border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-200 hover:border-gold hover:text-gold" />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 md:px-6">
            <p className="text-sm text-gray-300">
              Manage menu items, categories and content visible on the public
              site.
            </p>
            <div className="md:hidden">
              <LogoutButton className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-200 hover:border-gold hover:text-gold" />
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}




