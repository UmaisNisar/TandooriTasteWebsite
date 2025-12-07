import type { Metadata } from "next";
import MenuPageClient from "./MenuPageClient";

export const metadata: Metadata = {
  title: "Menu | Tandoori Tastes · Pakistani & Indian Cuisine in Sudbury",
  description:
    "Explore the full menu at Tandoori Tastes in Sudbury: tandoori & BBQ, curries, handi, karahi, biryani, vegetarian, breads, desserts and drinks."
};

export default function MenuPage() {
  return <MenuPageClient />;
}


