import type { Metadata } from "next";
import MenuPageClient from "./MenuPageClient";
import { fetchMenuData } from "@/lib/menu-helpers";

export const metadata: Metadata = {
  title: "Menu | Tandoori Tastes · Pakistani & Indian Cuisine in Sudbury",
  description:
    "Explore the full menu at Tandoori Tastes in Sudbury: tandoori & BBQ, curries, handi, karahi, biryani, vegetarian, breads, desserts and drinks."
};

// Use ISR for better performance - revalidate every 30 seconds
export const revalidate = 30;

export default async function MenuPage() {
  // Fetch menu data on the server
  const menuData = await fetchMenuData();
  
  return <MenuPageClient initialCategories={menuData.categories} initialItems={menuData.items} />;
}


