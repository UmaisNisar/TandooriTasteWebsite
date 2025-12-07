"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string };

export default function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      setCategories(json);
    }
    void load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      const json = await res.json();
      setCategories((prev) => [...prev, json]);
      setName("");
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const saveEdit = async () => {
    if (!editingId || !editingName.trim()) return;
    const res = await fetch(`/api/admin/categories/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName })
    });
    if (res.ok) {
      const json = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === json.id ? json : c))
      );
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category? It must not be used by items."))
      return;
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE"
    });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      const json = await res.json().catch(() => null);
      if (json?.error) {
        alert(json.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Categories</h1>
      <p className="text-sm text-gray-300">
        Manage the categories that group dishes on the public menu.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1.1fr)]">
        <form onSubmit={handleAdd} className="card-surface p-4 sm:p-6 space-y-3">
          <h2 className="font-heading text-lg text-gold">Add Category</h2>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gold">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 rounded-md border border-white/15 bg-black/40 px-2 text-sm text-white outline-none focus:border-gold/60 focus:ring-1 ring-gold/50"
              placeholder="e.g. Tandoori & BBQ"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft hover:bg-white"
          >
            Add Category
          </button>
        </form>

        <div className="card-surface p-4 sm:p-6 space-y-3">
          <h2 className="font-heading text-lg text-gold">Existing Categories</h2>
          <div className="space-y-2 text-sm">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col gap-2 rounded-md border border-white/10 bg-black/40 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                {editingId === cat.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-9 w-full rounded-md border border-white/15 bg-black/40 px-2 text-sm text-white outline-none focus:border-gold/60 focus:ring-1 ring-gold/50"
                  />
                ) : (
                  <span className="font-medium text-gray-100">{cat.name}</span>
                )}
                <div className="flex gap-2 text-xs">
                  {editingId === cat.id ? (
                    <>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="rounded-full border border-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                        className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-200"
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        className="rounded-full border border-red-500/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-xs text-gray-400">
                No categories yet. Add your first one to begin creating menu
                items.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




