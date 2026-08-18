import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/types";
import { whatsappLink } from "@/lib/business";
import { AmenityGlyph } from "./Icon";
import { WhatsAppLink } from "./WhatsAppLink";
import { ArrowRight, Users } from "./icons";

type Suite = Dictionary["suitesPage"]["items"][number];

export function SuiteCard({
  suite,
  labels,
  bookMessage,
  priority = false,
}: {
  suite: Suite;
  labels: { book: string; details: string; capacity: string };
  bookMessage: string;
  priority?: boolean;
}) {
  return (
    <article
      id={suite.slug}
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[340px]">
          <Image
            src={suite.image}
            alt={suite.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <h2 className="text-2xl font-semibold text-brand-800 sm:text-3xl">
              {suite.name}
            </h2>
            <p className="mt-3 text-ink-700">{suite.description}</p>
            <p className="mt-2 text-sm font-medium text-ink-500">{suite.beds}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
              {labels.details}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {suite.amenities.map((amenity) => (
                <li
                  key={amenity.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-700"
                >
                  <AmenityGlyph name={amenity.icon} className="h-4 w-4" />
                  {amenity.label}
                </li>
              ))}
            </ul>
          </div>

          <p className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
            <Users className="h-4 w-4 text-brand-500" aria-hidden="true" />
            {suite.capacity}
          </p>

          {suite.gallery.length > 0 ? (
            <div className="flex gap-3">
              {suite.gallery.map((shot) => (
                <div
                  key={shot.src}
                  className="relative h-20 w-24 overflow-hidden rounded-xl sm:h-24 sm:w-32"
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <WhatsAppLink
            href={whatsappLink(bookMessage)}
            location="suite_card"
            className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent-400 px-6 text-sm font-semibold text-ink-900 transition-colors hover:bg-accent-300 sm:w-auto sm:self-start"
          >
            {labels.book}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}
