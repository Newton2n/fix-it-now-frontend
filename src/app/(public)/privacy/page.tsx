import DashboardPageHeader from "@/components/dashboard/dashboard-page-header";
import SectionCard from "@/components/dashboard/section-card";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 2xl:px-12 2xl:py-12">
      <div className="space-y-6 sm:space-y-8 2xl:space-y-10">
        <DashboardPageHeader
          title="Privacy & Terms"
          description="How we handle your data and the rules for using FixItNow."
        />

        {/* Privacy Overview */}
        <SectionCard
          title="Privacy Overview"
          description="Data and privacy"
        >
          <div className="max-w-4xl space-y-5 text-sm leading-7 sm:text-base">
            <p>
              FixItNow collects and uses personal data only to provide and
              improve the service. This includes account information, booking
              details, and communication related to your bookings.
            </p>

            <p>
              We do not sell your personal data to third parties. Data is used
              for authentication, booking management, payments, support, and
              platform security.
            </p>

            {/* Your Rights */}
            <div className="rounded-lg border bg-muted/40 p-4 sm:p-5">
              <p className="font-medium">Your rights</p>

              <ul className="mt-3 space-y-2 pl-5 text-muted-foreground">
                <li className="list-disc">
                  Access and update your profile data
                </li>

                <li className="list-disc">
                  Request deletion of your account
                </li>

                <li className="list-disc">
                  Control certain notification preferences
                </li>
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* Terms of Use */}
        <SectionCard
          title="Terms of Use"
          description="Rules for using the platform"
        >
          <div className="max-w-4xl space-y-5 text-sm leading-7 sm:text-base">
            <p>By using FixItNow, you agree to follow these terms:</p>

            <ul className="space-y-2 pl-5">
              <li className="list-disc">
                Provide accurate information for bookings and profiles.
              </li>

              <li className="list-disc">
                Do not misuse the booking system or create fake accounts.
              </li>

              <li className="list-disc">
                Respect technicians and customers in all communications.
              </li>

              <li className="list-disc">
                Follow all applicable laws and platform policies.
              </li>
            </ul>

            <p>
              We may suspend or terminate accounts that violate these terms or
              engage in harmful or fraudulent activity.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}