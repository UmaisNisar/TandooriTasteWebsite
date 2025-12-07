"use client";

import { useState, useEffect } from "react";

type Announcement = {
  id: string;
  text: string;
  bgColor: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [newBgColor, setNewBgColor] = useState("#8B0000");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async () => {
    if (!newText) {
      alert("Text is required");
      return;
    }

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newText,
          bgColor: newBgColor,
          startDate: newStartDate || null,
          endDate: newEndDate || null
        })
      });
      const newAnn = await res.json();
      setAnnouncements([...announcements, newAnn]);
      setNewText("");
      setNewStartDate("");
      setNewEndDate("");
    } catch (err) {
      alert("Failed to add announcement");
    }
  };

  const updateAnnouncement = async (
    id: string,
    updates: Partial<Announcement>
  ) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setAnnouncements(
        announcements.map((a) => (a.id === id ? updated : a))
      );
    } catch (err) {
      alert("Failed to update");
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;

    try {
      await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) return <div className="text-gray-300">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Announcements</h1>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Create Announcement</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Text
            </label>
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              placeholder="Special offer this week!"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={newBgColor}
              onChange={(e) => setNewBgColor(e.target.value)}
              className="h-10 w-full rounded-md"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                Start Date (optional)
              </label>
              <input
                type="datetime-local"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                End Date (optional)
              </label>
              <input
                type="datetime-local"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              />
            </div>
          </div>
          <button
            onClick={addAnnouncement}
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
          >
            Create Announcement
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg text-gold">Existing Announcements</h2>
        {announcements.map((ann) => (
          <div key={ann.id} className="card-surface p-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={ann.isActive}
                onChange={(e) =>
                  updateAnnouncement(ann.id, { isActive: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm text-gray-300">
                {ann.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                Text
              </label>
              <input
                type="text"
                value={ann.text}
                onChange={(e) =>
                  updateAnnouncement(ann.id, { text: e.target.value })
                }
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-gold block mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  value={ann.bgColor}
                  onChange={(e) =>
                    updateAnnouncement(ann.id, { bgColor: e.target.value })
                  }
                  className="h-10 w-full rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gold block mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={
                    ann.startDate
                      ? new Date(ann.startDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    updateAnnouncement(ann.id, {
                      startDate: e.target.value || null
                    })
                  }
                  className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gold block mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={
                    ann.endDate
                      ? new Date(ann.endDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    updateAnnouncement(ann.id, {
                      endDate: e.target.value || null
                    })
                  }
                  className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
                />
              </div>
            </div>
            <button
              onClick={() => deleteAnnouncement(ann.id)}
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

