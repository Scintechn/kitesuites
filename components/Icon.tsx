import type { ComponentType, SVGProps } from "react";
import type { AmenityIcon, ServiceIcon } from "@/lib/i18n/types";
import {
  Coffee,
  Compass,
  Lock,
  Refrigerator,
  Tv,
  Umbrella,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
} from "./icons";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/** lucide has no kite glyph — the wind icon reads closest for kitesurf. */
const serviceIcons: Record<ServiceIcon, IconComponent> = {
  utensils: UtensilsCrossed,
  kite: Wind,
  umbrella: Umbrella,
  compass: Compass,
};

const amenityIcons: Record<AmenityIcon, IconComponent> = {
  coffee: Coffee,
  wind: Wind,
  wifi: Wifi,
  tv: Tv,
  fridge: Refrigerator,
  waves: Waves,
  lock: Lock,
  users: Users,
};

export function ServiceGlyph({
  name,
  className,
}: {
  name: ServiceIcon;
  className?: string;
}) {
  const Glyph = serviceIcons[name];
  return <Glyph className={className} aria-hidden="true" />;
}

export function AmenityGlyph({
  name,
  className,
}: {
  name: AmenityIcon;
  className?: string;
}) {
  const Glyph = amenityIcons[name];
  return <Glyph className={className} aria-hidden="true" />;
}
