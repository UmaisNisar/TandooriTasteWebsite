"use client";

import { useState, useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter content..."
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        className="min-h-[200px] w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none ring-gold/50 placeholder:text-gray-500 focus:border-gold/60 focus:ring-1 resize-y"
      />
      <p className="text-xs text-gray-400">
        Supports plain text. For formatting, use Markdown or HTML.
      </p>
    </div>
  );
}

