const steps = [
  {
    title: "1. Search Services",
    description: "Browse services and choose the right category for your needs.",
  },
  {
    title: "2. Pick a Technician",
    description: "Compare ratings, pricing, and profiles before booking.",
  },
  {
    title: "3. Book & Pay",
    description: "Select a time slot and complete payment after acceptance.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
          <p className="text-sm text-muted-foreground">
            Simple steps to get your home service done.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-xl border bg-background p-6">
              <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}