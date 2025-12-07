"use client";

import { useEffect, useState } from "react";
import DishCard from "@/components/DishCard";

type Category = { id: string; name: string };

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  category?: Category;
};

type FormState = {
  id?: string;
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
};

export default function AdminMenuClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: ""
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [catRes, itemRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/menu-items")
      ]);
      const [catJson, itemJson] = await Promise.all([
        catRes.json(),
        itemRes.json()
      ]);
      setCategories(catJson);
      setItems(itemJson);
      setLoading(false);
    }
    void load();
  }, []);

  const startEdit = (item: MenuItem) => {
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId,
      imageUrl: item.imageUrl ?? ""
    });
  };

  const resetForm = () =>
    setForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      imageUrl: ""
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: data
    });

    if (!res.ok) return;
    const json = await res.json();
    setForm((prev) => ({ ...prev, imageUrl: json.url as string }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.categoryId) {
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      categoryId: form.categoryId,
      imageUrl: form.imageUrl || null
    };

    const url = form.id
      ? `/api/admin/menu-items/${form.id}`
      : "/api/admin/menu-items";
    const method = form.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => {
        if (form.id) {
          return prev.map((item) =>
            item.id === form.id ? { ...item, ...updated } : item
          );
        }
        return [...prev, updated];
      });
      resetForm();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this menu item?")) return;
    const res = await fetch(`/api/admin/menu-items/${id}`, {
      method: "DELETE"
    });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Menu Items</h1>
      <p className="text-sm text-gray-300">
        Add, edit or remove dishes. Changes appear on the public menu
        immediately.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
        {/* List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-[0.2em]">
            Existing Items
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {loading && (
              <p className="text-sm text-gray-400">Loading menu items…</p>
            )}
            {!loading &&
              items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <DishCard
                    name={item.name}
                    description={item.description}
                    price={`CAD ${item.price.toFixed(2)}`}
                    imageUrl={
                      item.imageUrl ||
                      "https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    }
                  />
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="flex-1 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-200 hover:border-gold hover:text-gold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-300 hover:border-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Form */}
        <div className="card-surface p-4 sm:p-6 space-y-4">
          <h2 className="font-heading text-lg text-gold">
            {form.id ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="h-9 rounded-md border border-white/15 bg-black/40 px-2 text-sm text-white outline-none focus:border-gold/60 focus:ring-1 ring-gold/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="min-h-[70px] rounded-md border border-white/15 bg-black/40 px-2 py-1 text-sm text-white outline-none focus:border-gold/60 focus:ring-1 ring-gold/50"
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gold">
                  Price (CAD)
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="h-9 rounded-md border border-white/15 bg-black/40 px-2 text-sm text-white outline-none focus:border-gold/60 focus:ring-1 ring-gold/50"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gold">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="h-9 rounded-md border border-white/15 bg-black/40 px-2 text-sm text-white outline-none focus:border-gold/60 focus:ring-1 ring-gold/50"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gold">
                Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-gray-300"
              />
              {form.imageUrl && (
                <p className="text-[11px] text-gray-400 break-all">
                  Stored URL: {form.imageUrl}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-soft hover:bg-white disabled:opacity-60"
              >
                {form.id ? "Save Changes" : "Add Item"}
              </button>
              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-200 hover:border-gold hover:text-gold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




