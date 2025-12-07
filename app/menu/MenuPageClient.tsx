"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import MenuTabs, { MenuCategoryTab } from "@/components/MenuTabs";
import DishCard from "@/components/DishCard";

type MenuItemDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: { id: string; name: string };
};

export default function MenuPageClient() {
  const [categories, setCategories] = useState<MenuCategoryTab[]>([]);
  const [items, setItems] = useState<MenuItemDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "all">(
    "all"
  );

  useEffect(() => {
    async function loadMenu() {
      const res = await fetch("/api/menu");
      if (!res.ok) return;
      const data = await res.json();
      setCategories(
        (data.categories as { id: string; name: string }[]).map((c) => ({
          id: c.id,
          name: c.name
        }))
      );
      setItems(data.items as MenuItemDto[]);
    }

    void loadMenu();
  }, []);

  const filtered =
    selectedCategoryId === "all"
      ? items
      : items.filter((item) => item.category.id === selectedCategoryId);

  return (
    <>
      <PageHeader
        eyebrow="Our Menu"
        title="From the tandoor to your table"
        subtitle="All dishes are prepared halal and made to order. Ask us to adjust spice levels from mild to very spicy."
      />

      <section className="section-padding pt-0">
        <div className="container-section space-y-6">
          <MenuTabs
            categories={categories}
            activeId={selectedCategoryId}
            onChange={setSelectedCategoryId}
          />
          <p className="text-xs text-gray-300">
            Menu items and prices are stored in the admin panel. Update them
            there to reflect your live offerings and pricing.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <DishCard
                key={item.id}
                name={item.name}
                description={item.description}
                price={`CAD ${item.price.toFixed(2)}`}
                imageUrl={
                  item.imageUrl ||
                  "https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

