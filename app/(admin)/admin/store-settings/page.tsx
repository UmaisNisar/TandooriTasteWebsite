"use client";

import { useState, useEffect } from "react";

type StoreHours = {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};

type Holiday = {
  id: string;
  date: string;
  title: string;
  description: string | null;
  isClosed: boolean;
  overrideOpenTime: string | null;
  overrideCloseTime: string | null;
};

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" }
];

export default function StoreSettingsPage() {
  const [hours, setHours] = useState<StoreHours[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [newHoliday, setNewHoliday] = useState({
    date: "",
    title: "",
    description: "",
    isClosed: true,
    overrideOpenTime: "",
    overrideCloseTime: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hoursRes, holidaysRes, settingsRes] = await Promise.all([
        fetch("/api/admin/store-hours"),
        fetch("/api/admin/holidays"),
        fetch("/api/admin/store-settings")
      ]);

      const hoursData = await hoursRes.json();
      const holidaysData = await holidaysRes.json();
      const settingsData = await settingsRes.json();

      setHours(hoursData);
      setHolidays(holidaysData);
      setSettings(settingsData);

      // Initialize hours for days that don't exist
      const existingDays = new Set(hoursData.map((h: StoreHours) => h.dayOfWeek));
      const missingHours = DAYS.filter(
        (day) => !existingDays.has(day.value)
      ).map((day) => ({
        id: "",
        dayOfWeek: day.value,
        openTime: null,
        closeTime: null,
        isClosed: true
      }));
      setHours([...hoursData, ...missingHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek));
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateHours = async (dayOfWeek: number, updates: Partial<StoreHours>) => {
    try {
      const res = await fetch("/api/admin/store-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayOfWeek, ...updates })
      });
      const updated = await res.json();
      setHours(hours.map((h) => (h.dayOfWeek === dayOfWeek ? updated : h)));
    } catch (err) {
      alert("Failed to update hours");
    }
  };

  const addHoliday = async () => {
    if (!newHoliday.date || !newHoliday.title) {
      alert("Date and title are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHoliday)
      });
      const holiday = await res.json();
      setHolidays([...holidays, holiday]);
      setNewHoliday({
        date: "",
        title: "",
        description: "",
        isClosed: true,
        overrideOpenTime: "",
        overrideCloseTime: ""
      });
    } catch (err) {
      alert("Failed to add holiday");
    }
  };

  const updateHoliday = async (id: string, updates: Partial<Holiday>) => {
    try {
      const res = await fetch(`/api/admin/holidays/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      const updated = await res.json();
      setHolidays(holidays.map((h) => (h.id === id ? updated : h)));
    } catch (err) {
      alert("Failed to update holiday");
    }
  };

  const deleteHoliday = async (id: string) => {
    if (!confirm("Delete this holiday?")) return;

    try {
      await fetch(`/api/admin/holidays/${id}`, { method: "DELETE" });
      setHolidays(holidays.filter((h) => h.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await fetch("/api/admin/store-settings", {
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
      <h1 className="font-heading text-2xl text-gold">Store Management</h1>

      {/* Store Hours */}
      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Store Hours</h2>
        <div className="space-y-3">
          {hours.map((hour) => {
            const day = DAYS.find((d) => d.value === hour.dayOfWeek);
            return (
              <div
                key={hour.dayOfWeek}
                className="grid gap-3 sm:grid-cols-5 items-center p-3 bg-black/40 rounded-md"
              >
                <div className="sm:col-span-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!hour.isClosed}
                      onChange={(e) =>
                        updateHours(hour.dayOfWeek, { isClosed: !e.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-white">
                      {day?.label}
                    </span>
                  </label>
                </div>
                {!hour.isClosed && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-300 block mb-1">
                        Open Time
                      </label>
                      <input
                        type="time"
                        value={hour.openTime || ""}
                        onChange={(e) =>
                          updateHours(hour.dayOfWeek, { openTime: e.target.value })
                        }
                        className="w-full h-9 rounded-md border border-white/15 bg-black/40 px-2 text-sm text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-300 block mb-1">
                        Close Time
                      </label>
                      <input
                        type="time"
                        value={hour.closeTime || ""}
                        onChange={(e) =>
                          updateHours(hour.dayOfWeek, { closeTime: e.target.value })
                        }
                        className="w-full h-9 rounded-md border border-white/15 bg-black/40 px-2 text-sm text-white"
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Holidays */}
      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Holidays & Special Closures</h2>

        <div className="space-y-3 p-4 bg-black/40 rounded-md">
          <h3 className="text-sm font-semibold text-gold mb-3">Add New Holiday</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                Date
              </label>
              <input
                type="date"
                value={newHoliday.date}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, date: e.target.value })
                }
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                Title
              </label>
              <input
                type="text"
                value={newHoliday.title}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, title: e.target.value })
                }
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
                placeholder="Christmas Day"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gold block mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                value={newHoliday.description}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, description: e.target.value })
                }
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newHoliday.isClosed}
                onChange={(e) =>
                  setNewHoliday({ ...newHoliday, isClosed: e.target.checked })
                }
                className="rounded"
              />
              <label className="text-xs text-gray-300">Closed on this day</label>
            </div>
            {!newHoliday.isClosed && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gold block mb-1">
                    Override Open Time
                  </label>
                  <input
                    type="time"
                    value={newHoliday.overrideOpenTime}
                    onChange={(e) =>
                      setNewHoliday({
                        ...newHoliday,
                        overrideOpenTime: e.target.value
                      })
                    }
                    className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gold block mb-1">
                    Override Close Time
                  </label>
                  <input
                    type="time"
                    value={newHoliday.overrideCloseTime}
                    onChange={(e) =>
                      setNewHoliday({
                        ...newHoliday,
                        overrideCloseTime: e.target.value
                      })
                    }
                    className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
                  />
                </div>
              </>
            )}
          </div>
          <button
            onClick={addHoliday}
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
          >
            Add Holiday
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {holidays.map((holiday) => (
            <div key={holiday.id} className="p-4 bg-black/40 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{holiday.title}</p>
                  <p className="text-xs text-gray-300">
                    {new Date(holiday.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteHoliday(holiday.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
              {holiday.description && (
                <p className="text-sm text-gray-300">{holiday.description}</p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={holiday.isClosed}
                  onChange={(e) =>
                    updateHoliday(holiday.id, { isClosed: e.target.checked })
                  }
                  className="rounded"
                />
                <label className="text-xs text-gray-300">Closed</label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Links */}
      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Delivery & Order Links</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Uber Eats URL
            </label>
            <input
              type="url"
              value={settings.uberEatsUrl || ""}
              onChange={(e) => updateSetting("uberEatsUrl", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              DoorDash URL
            </label>
            <input
              type="url"
              value={settings.doorDashUrl || ""}
              onChange={(e) => updateSetting("doorDashUrl", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              SkipTheDishes URL
            </label>
            <input
              type="url"
              value={settings.skipTheDishesUrl || ""}
              onChange={(e) => updateSetting("skipTheDishesUrl", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Custom Order URL
            </label>
            <input
              type="url"
              value={settings.customOrderUrl || ""}
              onChange={(e) => updateSetting("customOrderUrl", e.target.value)}
              className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              placeholder="https://..."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

