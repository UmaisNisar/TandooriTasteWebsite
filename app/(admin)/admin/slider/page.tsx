"use client";

import { useState, useEffect } from "react";

type Slide = {
  id: string;
  imageUrl: string;
  caption: string | null;
  altText: string | null;
  order: number;
  isActive: boolean;
};

export default function SliderPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newAltText, setNewAltText] = useState("");

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const res = await fetch("/api/admin/slider");
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSlide = async () => {
    if (!newImageUrl) {
      alert("Image URL is required");
      return;
    }

    try {
      const res = await fetch("/api/admin/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: newImageUrl,
          caption: newCaption || null,
          altText: newAltText || null,
          order: slides.length
        })
      });
      const newSlide = await res.json();
      setSlides([...slides, newSlide]);
      setNewImageUrl("");
      setNewCaption("");
      setNewAltText("");
    } catch (err) {
      alert("Failed to add slide");
    }
  };

  const updateSlide = async (id: string, updates: Partial<Slide>) => {
    try {
      const res = await fetch(`/api/admin/slider/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setSlides(slides.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      alert("Failed to update");
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Delete this slide?")) return;

    try {
      await fetch(`/api/admin/slider/${id}`, { method: "DELETE" });
      setSlides(slides.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) return <div className="text-gray-300">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Home Slider</h1>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Add New Slide</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Caption (optional)
            </label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Alt Text (optional)
            </label>
            <input
              type="text"
              value={newAltText}
              onChange={(e) => setNewAltText(e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
            />
          </div>
          <button
            onClick={addSlide}
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
          >
            Add Slide
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg text-gold">Existing Slides</h2>
        {slides.map((slide) => (
          <div key={slide.id} className="card-surface p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={slide.isActive}
                onChange={(e) =>
                  updateSlide(slide.id, { isActive: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm text-gray-300">
                {slide.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={slide.imageUrl}
                onChange={(e) =>
                  updateSlide(slide.id, { imageUrl: e.target.value })
                }
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-gold block mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={slide.caption || ""}
                  onChange={(e) =>
                    updateSlide(slide.id, { caption: e.target.value || null })
                  }
                  className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gold block mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={slide.altText || ""}
                  onChange={(e) =>
                    updateSlide(slide.id, { altText: e.target.value || null })
                  }
                  className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
                />
              </div>
            </div>
            <button
              onClick={() => deleteSlide(slide.id)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

