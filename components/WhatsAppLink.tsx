"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@vercel/analytics";

export type WhatsAppLocation =
  | "fab"
  | "header"
  | "hero"
  | "suite_card"
  | "service_card"
  | "final_cta"
  | "contact_direct"
  | "footer";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
  href: string;
  location: WhatsAppLocation;
  children: ReactNode;
};

export function WhatsAppLink({ href, location, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { location })}
    >
      {children}
    </a>
  );
}
