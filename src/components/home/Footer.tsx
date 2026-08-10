import { Separator } from "@/components/ui/separator";
import { BrandMark, BrandWordmark } from "./BrandMark";

const GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Services", href: "#services" },
      { label: "Categories", href: "#categories" },
      { label: "Technicians", href: "#technicians" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#top" },
      { label: "Contact", href: "#final-cta" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "#top" },
      { label: "Register", href: "#top" },
    ],
  },
  {
    title: "Support",
    links: [{ label: "Help & FAQ", href: "#faq" }],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-surface">
      <div className="section-x mx-auto max-w-[110rem] py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <BrandWordmark />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Find trusted professionals for your home, book with confidence, and get the job done.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:justify-items-end"
          >
            {GROUPS.map((group) => (
              <div key={group.title} className="min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="cursor-pointer text-sm text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FixItNow. All rights reserved.</p>
          <p>Home services booking platform.</p>
        </div>
      </div>
    </footer>
  );
}