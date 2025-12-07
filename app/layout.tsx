import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Tandoori Tastes | Authentic Pakistani & Indian Cuisine in Sudbury",
  description:
    "Experience rich Pakistani and Indian flavours at Tandoori Tastes in Sudbury, Ontario. Dine-in, takeout, and catering with tandoori, curries, biryani, and more.",
  metadataBase: new URL("https://tandoori-tastes.example.com"),
  openGraph: {
    title: "Tandoori Tastes | Authentic Pakistani & Indian Cuisine",
    description:
      "A warm, elegant dining experience in Sudbury featuring tandoori, curries, biryani, and more.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-charcoal text-white font-body antialiased">
        <Providers>
          <AnnouncementBanner />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


