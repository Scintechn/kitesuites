import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

type Body = { heading: string; paragraphs: string[] }[];

export function LegalPage({
  title,
  updated,
  body,
}: {
  title: string;
  updated: string;
  body: Body;
}) {
  return (
    <>
      <Section variant="brand" className="py-14 sm:py-20">
        <Container>
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-brand-200">{updated}</p>
        </Container>
      </Section>

      <Section variant="paper">
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {body.map((block) => (
              <section key={block.heading}>
                <h2 className="text-xl font-semibold text-brand-800">
                  {block.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-ink-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
