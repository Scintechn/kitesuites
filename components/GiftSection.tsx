import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "./LeadForm";
import { Check, Gift } from "./icons";

/**
 * Permanent home-page lead capture. Always available and interrupts nobody —
 * the modal is the opt-in nudge on top of this, not a replacement for it.
 */
export function GiftSection({
  t,
  locale,
}: {
  t: Dictionary["gift"];
  locale: Locale;
}) {
  return (
    <Section variant="paper-warm" id="presente">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
                <Gift className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-accent-600">
                {t.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-brand-800 sm:text-4xl">
                {t.title}
              </h2>
              <p className="mt-4 text-lg text-ink-700">{t.subtitle}</p>

              <ul className="mt-7 space-y-3">
                {t.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-ink-700">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-accent-500"
                      aria-hidden="true"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <LeadForm t={t} locale={locale} source="section" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
