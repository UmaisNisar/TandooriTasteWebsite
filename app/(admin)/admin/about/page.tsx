"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";

type ContentBlock = {
  id: string;
  section: string;
  content: string;
};

export default function AboutContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/content-blocks?page=about");
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
        page: "about",
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

  const storyBlock = blocks.find((b) => b.section === "story");
  const chefBlock = blocks.find((b) => b.section === "chef");
  const missionBlock = blocks.find((b) => b.section === "mission");

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl text-gold">About Page Content</h1>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Restaurant Story</h2>
        <RichTextEditor
          value={storyBlock?.content || ""}
          onChange={async (value) => {
            const block =
              storyBlock ||
              (await getOrCreateBlock("story", value));
            saveBlock({ ...block, content: value });
            setBlocks(
              blocks.map((b) =>
                b.id === block.id ? { ...b, content: value } : b
              )
            );
          }}
        />
      </section>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Chef / Culture</h2>
        <RichTextEditor
          value={chefBlock?.content || ""}
          onChange={async (value) => {
            const block =
              chefBlock ||
              (await getOrCreateBlock("chef", value));
            saveBlock({ ...block, content: value });
            setBlocks(
              blocks.map((b) =>
                b.id === block.id ? { ...b, content: value } : b
              )
            );
          }}
        />
      </section>

      <section className="card-surface p-6 space-y-4">
        <h2 className="font-heading text-lg text-gold">Mission / Values</h2>
        <RichTextEditor
          value={missionBlock?.content || ""}
          onChange={async (value) => {
            const block =
              missionBlock ||
              (await getOrCreateBlock("mission", value));
            saveBlock({ ...block, content: value });
            setBlocks(
              blocks.map((b) =>
                b.id === block.id ? { ...b, content: value } : b
              )
            );
          }}
        />
      </section>
    </div>
  );
}

