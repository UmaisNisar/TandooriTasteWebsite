"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });
      setSettings({ ...settings, [key]: value });
    } catch (err) {
      alert("Failed to save");
    }
  };

  if (loading) return <div className="text-gray-300">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Site Settings</h1>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">SEO & Metadata</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Site Title
            </label>
            <input
              type="text"
              value={settings.siteTitle || ""}
              onChange={(e) => updateSetting("siteTitle", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription || ""}
              onChange={(e) =>
                updateSetting("siteDescription", e.target.value)
              }
              className="w-full min-h-[100px] rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={settings.keywords || ""}
              onChange={(e) => updateSetting("keywords", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              OpenGraph Image URL
            </label>
            <input
              type="text"
              value={settings.ogImage || ""}
              onChange={(e) => updateSetting("ogImage", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
        </div>
      </section>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Branding</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Logo URL
            </label>
            <input
              type="text"
              value={settings.logoUrl || ""}
              onChange={(e) => updateSetting("logoUrl", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Favicon URL
            </label>
            <input
              type="text"
              value={settings.faviconUrl || ""}
              onChange={(e) => updateSetting("faviconUrl", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
        </div>
      </section>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Colors</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Primary Color
            </label>
            <input
              type="color"
              value={settings.primaryColor || "#8B0000"}
              onChange={(e) => updateSetting("primaryColor", e.target.value)}
              className="h-10 w-full rounded-md"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Secondary Color
            </label>
            <input
              type="color"
              value={settings.secondaryColor || "#D4AF37"}
              onChange={(e) =>
                updateSetting("secondaryColor", e.target.value)
              }
              className="h-10 w-full rounded-md"
            />
          </div>
        </div>
      </section>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Typography</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Heading Font
            </label>
            <input
              type="text"
              value={settings.headingFont || "Playfair Display"}
              onChange={(e) => updateSetting("headingFont", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Body Font
            </label>
            <input
              type="text"
              value={settings.bodyFont || "Inter"}
              onChange={(e) => updateSetting("bodyFont", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

