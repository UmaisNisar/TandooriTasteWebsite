"use client";

export type MenuCategoryTab = {
  id: string;
  name: string;
};

type MenuTabsProps = {
  categories: MenuCategoryTab[];
  activeId: string | "all";
  onChange: (id: string | "all") => void;
};

export default function MenuTabs({
  categories,
  activeId,
  onChange
}: MenuTabsProps) {
  return (
    <div className="card-surface flex gap-2 overflow-x-auto p-2 text-xs sm:text-sm">
      {[{ id: "all", name: "All" }, ...categories].map((category) => {
        const isActive = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`whitespace-nowrap rounded-full px-3 py-2 font-medium transition ${
              isActive
                ? "bg-gold text-charcoal shadow-soft"
                : "bg-white/5 text-gray-200 hover:bg-white/10"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

