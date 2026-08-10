"use client"
import { useEffect, useState } from "react";
import { LogIn, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BrandMark, BrandWordmark } from "./BrandMark";

const NAV = [
  { id: "top", label: "Home" },
  { id: "services", label: "Services" },
  { id: "categories", label: "Categories" },
  { id: "technicians", label: "Technicians" },
];

function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

export function Navbar() {
  const active = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = document.getElementById("top");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setScrolled(!entry.isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-background",
      )}
    >
      <nav
        aria-label="Primary"
        className="section-x mx-auto flex h-16 max-w-[110rem] items-center gap-4"
      >
        <a
          href="#top"
          className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <BrandMark />
          <BrandWordmark />
          <span className="sr-only">FixItNow home</span>
        </a>

        <ul className="ml-4 hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-9 cursor-pointer items-center rounded-md px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-secondary font-semibold text-primary"
                      : "font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" className="gap-2">
            <Search aria-hidden="true" />
            Find a service
          </Button>
          <Separator orientation="vertical" className="mx-1 h-5" />
          {/* Logged-out state. When authenticated, swap for Dashboard / Profile / Logout. */}
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button variant="hero" size="sm">
            Register
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Button variant="heroSecondary" size="sm" className="hidden sm:inline-flex">
            Login
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <SheetTitle className="flex items-center gap-2.5">
                  <BrandMark />
                  <BrandWordmark />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-3 py-4">
                {NAV.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active === item.id
                        ? "bg-secondary font-semibold text-primary"
                        : "font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <Separator />
              <div className="flex flex-col gap-2 px-5 py-4">
                <Button variant="hero" className="w-full gap-2">
                  <LogIn aria-hidden="true" />
                  Login
                </Button>
                <Button variant="heroSecondary" className="w-full">
                  Register
                </Button>
                <p className="pt-2 text-xs text-muted-foreground">
                  Signed in? Your dashboard, profile and logout appear here.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}