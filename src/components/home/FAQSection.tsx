import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./Reveal";

const FAQS = [
  {
    q: "How does FixItNow work?",
    a: "You choose a service, review the professionals who cover your area, check their availability, and book a slot. Payment and booking management happen in your account.",
  },
  {
    q: "How do I find a technician?",
    a: "Browse by category or search for a service. Each result links to a technician profile with skills, experience, service area and availability.",
  },
  {
    q: "Can I check technician availability?",
    a: "Yes. Technicians publish the days and time slots they can take work, and you can only book slots they've opened.",
  },
  {
    q: "How does booking work?",
    a: "A booking combines a service, a technician, a date and a time. Once confirmed, the technician receives the request and you can track its status.",
  },
  {
    q: "How are technicians presented?",
    a: "Every profile shows skills, years of experience, service areas, availability, and ratings from completed bookings once reviews exist.",
  },
  {
    q: "How are payments handled?",
    a: "Payments are made online through the platform when you book, and every transaction is recorded against the booking in your account.",
  },
  {
    q: "Can technicians manage their availability?",
    a: "Yes. Technicians manage their profile, services, service areas, availability and incoming bookings from their own dashboard.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="w-full border-b border-border bg-surface py-16 lg:py-24">
      <div className="section-x mx-auto grid max-w-[110rem] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions before you book?"
            description="The short answers to how FixItNow works for customers and technicians."
          />
        </Reveal>
        <Reveal delay={100} className="min-w-0">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q} className="border-border">
                <AccordionTrigger className="cursor-pointer text-left text-sm font-semibold hover:no-underline sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}