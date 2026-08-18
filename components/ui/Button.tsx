import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "outline-light";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-400 text-ink-900 hover:bg-accent-300 active:bg-accent-500 shadow-sm hover:shadow-md focus-visible:ring-accent-400",
  secondary:
    "bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-700 focus-visible:ring-brand-700",
  ghost:
    "bg-transparent text-ink-900 hover:bg-ink-100 focus-visible:ring-brand-600",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1ebe5a] active:bg-[#179a4a] shadow-sm hover:shadow-md focus-visible:ring-[#25D366]",
  "outline-light":
    "border border-white/40 bg-white/5 text-white hover:bg-white/15 focus-visible:ring-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-7 text-base sm:text-lg",
};

export function Button(props: AnchorProps | ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;
  const styles = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={styles} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={styles} {...buttonRest}>
      {children}
    </button>
  );
}
