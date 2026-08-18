"use client";

import { track } from "@vercel/analytics";
import { business, whatsappLink } from "@/lib/business";
import { MessageCircle } from "@/components/icons";

export function WhatsAppFab({ message, label }: { message: string; label: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ${business.brandName}`}
      onClick={() => track("whatsapp_click", { location: "fab" })}
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 sm:bottom-7 sm:right-7"
    >
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping"
        aria-hidden="true"
      />
      <MessageCircle className="relative h-7 w-7" strokeWidth={2.25} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </a>
  );
}
