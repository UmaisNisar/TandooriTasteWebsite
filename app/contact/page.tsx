import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Contact | Tandoori Tastes · Visit or Book in Sudbury",
  description:
    "Contact Tandoori Tastes in Sudbury, Ontario. View our address, hours, phone, email, map and send a message for reservations or catering."
};

// Use ISR for better performance - revalidate every 30 seconds
export const revalidate = 30;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s plan your next meal"
        subtitle="Have questions about the menu, dietary needs or catering? Reach out and our team will be happy to help."
      />
      <ContactSection />
    </>
  );
}




