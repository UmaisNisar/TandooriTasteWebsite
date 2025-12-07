"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";

type ContentBlock = {
  id: string;
  page: string;
  section: string;
  content: string;
  order: number;
};

type MenuItem = {
  id: string;
  name: string;
};

type FeaturedDish = {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  order: number;
};

export default function HomepageContentClient() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [featured, setFeatured] = useState<FeaturedDish[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [blocksRes, featuredRes, menuRes] = await Promise.all([
        fetch("/api/admin/content-blocks?page=home"),
        fetch("/api/admin/featured-dishes"),
        fetch("/api/menu")
      ]);

      const blocksData = await blocksRes.json();
      const featuredData = await featuredRes.json();
      const menuData = await menuRes.json();

      setBlocks(blocksData);
      setFeatured(featuredData);
      setMenuItems(menuData.items || []);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveBlock = async (block: ContentBlock) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/content-blocks/${block.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: block.content })
      });
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getOrCreateBlock = async (section: string, defaultContent: string): Promise<ContentBlock> => {
    const existing = blocks.find((b) => b.section === section);
    if (existing) return existing;

    const res = await fetch("/api/admin/content-blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: "home",
        section,
        content: defaultContent,
        order: blocks.length
      })
    });
    const newBlock = await res.json();
    setBlocks([...blocks, newBlock]);
    return newBlock;
  };

  const addFeaturedDish = async (menuItemId: string) => {
    const res = await fetch("/api/admin/featured-dishes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, order: featured.length })
    });
    const newFeatured = await res.json();
    setFeatured([...featured, newFeatured]);
  };

  const removeFeaturedDish = async (id: string) => {
    await fetch(`/api/admin/featured-dishes/${id}`, { method: "DELETE" });
    setFeatured(featured.filter((f) => f.id !== id));
  };

  if (loading) {
    return <div className="text-gray-300">Loading...</div>;
  }

  const heroBlock = blocks.find((b) => b.section === "hero") || {
    id: "",
    page: "home",
    section: "hero",
    content: '{"title":"Welcome to Tandoori Tastes","subtitle":"Authentic Pakistani & Indian Cuisine","cta1":"Order Now","cta2":"View Menu","imageUrl":""}',
    order: 0
  };
  const heroData = JSON.parse(heroBlock.content || "{}");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Homepage Content</h1>

      {/* Hero Section */}
      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Hero Section</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Title
            </label>
            <input
              type="text"
              value={heroData.title || ""}
              onChange={async (e) => {
                const updated = { ...heroData, title: e.target.value };
                let blockToSave = heroBlock;
                if (!heroBlock.id) {
                  blockToSave = await getOrCreateBlock("hero", JSON.stringify(updated));
                }
                saveBlock({ ...blockToSave, content: JSON.stringify(updated) });
              }}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={heroData.subtitle || ""}
              onChange={async (e) => {
                const updated = { ...heroData, subtitle: e.target.value };
                let blockToSave = heroBlock;
                if (!heroBlock.id) {
                  blockToSave = await getOrCreateBlock("hero", JSON.stringify(updated));
                }
                saveBlock({ ...blockToSave, content: JSON.stringify(updated) });
              }}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Background Image URL
            </label>
            <input
              type="text"
              value={heroData.imageUrl || ""}
              onChange={async (e) => {
                const updated = { ...heroData, imageUrl: e.target.value };
                let blockToSave = heroBlock;
                if (!heroBlock.id) {
                  blockToSave = await getOrCreateBlock("hero", JSON.stringify(updated));
                }
                saveBlock({ ...blockToSave, content: JSON.stringify(updated) });
              }}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Featured Dishes</h2>
        <div className="space-y-2">
          {featured.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-3 bg-black/40 rounded-md"
            >
              <span className="text-sm text-gray-200">{f.menuItem.name}</span>
              <button
                onClick={() => removeFeaturedDish(f.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <select
          onChange={(e) => {
            if (e.target.value) {
              addFeaturedDish(e.target.value);
              e.target.value = "";
            }
          }}
          className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
        >
          <option value="">Add a dish...</option>
          {menuItems
            .filter((item) => !featured.some((f) => f.menuItemId === item.id))
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      </section>

      {/* Why Choose Us */}
      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Why Choose Us</h2>
        <p className="text-sm text-gray-300">
          Edit the "Why Choose Us" section content. Use JSON format: {"{"}
          "items": [{"{"} "icon": "...", "title": "...", "description": "..."
          {"}"}]
          {"}"}
        </p>
        <RichTextEditor
          value={
            blocks.find((b) => b.section === "why-choose-us")?.content ||
            '{"items":[]}'
          }
          onChange={(value) => {
            const block = blocks.find((b) => b.section === "why-choose-us");
            if (block) {
              saveBlock({ ...block, content: value });
            } else {
              getOrCreateBlock("why-choose-us", value).then((b) =>
                saveBlock({ ...b, content: value })
              );
            }
          }}
        />
      </section>
    </div>
  );
}

