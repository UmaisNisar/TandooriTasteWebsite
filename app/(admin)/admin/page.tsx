import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [itemCount, categoryCount] = await Promise.all([
    prisma.menuItem.count(),
    prisma.category.count()
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Dashboard</h1>
      <p className="text-sm text-gray-300">
        Overview of content that powers the public Tandoori Tastes website.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card-surface p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Menu Items
          </p>
          <p className="mt-2 font-heading text-3xl text-gold">{itemCount}</p>
        </div>
        <div className="card-surface p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Categories
          </p>
          <p className="mt-2 font-heading text-3xl text-gold">
            {categoryCount}
          </p>
        </div>
      </div>
    </div>
  );
}




