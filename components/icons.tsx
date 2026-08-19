import type { SVGProps } from "react";

export {
  ArrowRight,
  BedDouble,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Copy,
  Compass,
  Gift,
  Loader2,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Refrigerator,
  Sparkles,
  Tv,
  Umbrella,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  X,
} from "lucide-react";

/**
 * lucide dropped brand marks in v1, so the Instagram glyph is hand-rolled.
 * Stroke geometry matches lucide's 24px / 2px grid so it sits next to the
 * other icons without looking off.
 */
export function Instagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
