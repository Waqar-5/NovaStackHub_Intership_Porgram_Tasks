import { faqs } from "@/lib/mock-data";
import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <Reveal className="text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Accordion type="single" collapsible>
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
