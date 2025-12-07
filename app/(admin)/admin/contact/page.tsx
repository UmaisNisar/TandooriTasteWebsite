"use client";

import { useState, useEffect } from "react";

type ContentBlock = {
  id: string;
  section: string;
  content: string;
};

export default function ContactContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/content-blocks?page=contact");
      const data = await res.json();
      setBlocks(data);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveBlock = async (block: ContentBlock) => {
    try {
      await fetch(`/api/admin/content-blocks/${block.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: block.content })
      });
    } catch (err) {
      alert("Failed to save. Please try again.");
    }
  };

  const getOrCreateBlock = async (section: string, defaultContent: string) => {
    const existing = blocks.find((b) => b.section === section);
    if (existing) return existing;

    const res = await fetch("/api/admin/content-blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: "contact",
        section,
        content: defaultContent,
        order: blocks.length
      })
    });
    const newBlock = await res.json();
    setBlocks([...blocks, newBlock]);
    return newBlock;
  };

  if (loading) return <div className="text-gray-300">Loading...</div>;

  const contactBlock = blocks.find((b) => b.section === "info");
  const contactData = contactBlock
    ? JSON.parse(contactBlock.content || "{}")
    : {
        address: "",
        phone: "",
        email: "",
        mapUrl: "",
        hours: "",
        facebook: "",
        instagram: "",
        tiktok: ""
      };

  const updateContact = (key: string, value: string) => {
    const updated = { ...contactData, [key]: value };
    const block = contactBlock || { id: "", section: "info", content: "{}" };
    saveBlock({
      ...block,
      content: JSON.stringify(updated)
    });
    setBlocks(
      blocks.map((b) =>
        b.id === block.id
          ? { ...b, content: JSON.stringify(updated) }
          : b
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Contact Page Content</h1>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Contact Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Address
            </label>
            <input
              type="text"
              value={contactData.address || ""}
              onChange={(e) => updateContact("address", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Phone
            </label>
            <input
              type="text"
              value={contactData.phone || ""}
              onChange={(e) => updateContact("phone", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Email
            </label>
            <input
              type="email"
              value={contactData.email || ""}
              onChange={(e) => updateContact("email", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Google Maps Embed URL
            </label>
            <input
              type="text"
              value={contactData.mapUrl || ""}
              onChange={(e) => updateContact("mapUrl", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gold block mb-1">
              Opening Hours (JSON format)
            </label>
            <textarea
              value={contactData.hours || ""}
              onChange={(e) => updateContact("hours", e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
              placeholder='{"monday": "Closed", "tuesday": "11am-10pm", ...}'
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={contactData.facebook || ""}
              onChange={(e) => updateContact("facebook", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={contactData.instagram || ""}
              onChange={(e) => updateContact("instagram", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              TikTok URL
            </label>
            <input
              type="url"
              value={contactData.tiktok || ""}
              onChange={(e) => updateContact("tiktok", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

