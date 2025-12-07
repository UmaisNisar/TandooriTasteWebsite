"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Review = {
  id: string;
  reviewerName: string;
  reviewerImageUrl: string | null;
  rating: number;
  text: string;
  isVisible: boolean;
  createdAt: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    reviewerName: "",
    reviewerImageUrl: "",
    rating: 5,
    text: "",
    isVisible: true
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData
      });

      const data = await res.json();
      setFormData((prev) => ({ ...prev, reviewerImageUrl: data.url }));
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reviewerName || !formData.text) {
      alert("Reviewer name and text are required");
      return;
    }

    try {
      if (editingId) {
        await fetch(`/api/admin/reviews/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch("/api/admin/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }

      setFormData({
        reviewerName: "",
        reviewerImageUrl: "",
        rating: 5,
        text: "",
        isVisible: true
      });
      setEditingId(null);
      loadReviews();
    } catch (err) {
      alert("Failed to save review");
    }
  };

  const handleEdit = (review: Review) => {
    setFormData({
      reviewerName: review.reviewerName,
      reviewerImageUrl: review.reviewerImageUrl || "",
      rating: review.rating,
      text: review.text,
      isVisible: review.isVisible
    });
    setEditingId(review.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;

    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      loadReviews();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !currentVisibility })
      });
      loadReviews();
    } catch (err) {
      alert("Failed to update visibility");
    }
  };

  if (loading) return <div className="text-gray-300">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">Reviews & Testimonials</h1>

      {/* Add/Edit Form */}
      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">
          {editingId ? "Edit Review" : "Add New Review"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                Reviewer Name *
              </label>
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) =>
                  setFormData({ ...formData, reviewerName: e.target.value })
                }
                required
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gold block mb-1">
                Rating (1-5 stars) *
              </label>
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                required
                className="w-full h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white"
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Reviewer Image (optional)
            </label>
            <div className="flex gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1 h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-charcoal file:cursor-pointer disabled:opacity-50"
              />
              {formData.reviewerImageUrl && (
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/15">
                  <Image
                    src={formData.reviewerImageUrl}
                    alt="Reviewer"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            {uploading && (
              <p className="text-xs text-gray-400 mt-1">Uploading...</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gold block mb-1">
              Review Text *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              required
              rows={4}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white resize-y"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) =>
                setFormData({ ...formData, isVisible: e.target.checked })
              }
              className="rounded"
            />
            <label className="text-xs text-gray-300">Visible on public site</label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
            >
              {editingId ? "Update Review" : "Add Review"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    reviewerName: "",
                    reviewerImageUrl: "",
                    rating: 5,
                    text: "",
                    isVisible: true
                  });
                }}
                className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Reviews List */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg text-gold">All Reviews</h2>
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`card-surface p-4 space-y-3 ${
                !review.isVisible ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {review.reviewerImageUrl && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/15 flex-shrink-0">
                      <Image
                        src={review.reviewerImageUrl}
                        alt={review.reviewerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">
                        {review.reviewerName}
                      </p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < review.rating ? "text-gold" : "text-gray-500"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {!review.isVisible && (
                        <span className="text-xs text-gray-400">(Hidden)</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{review.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleEdit(review)}
                  className="text-xs text-gold hover:text-gold/80"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleVisibility(review.id, review.isVisible)}
                  className="text-xs text-gray-300 hover:text-white"
                >
                  {review.isVisible ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No reviews yet. Add your first review above.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

