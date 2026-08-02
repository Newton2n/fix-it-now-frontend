import { Suspense } from "react";
import { notFound } from "next/navigation";

import BookingForm from "@/components/booking/booking-form";
import { getSingleService } from "@/actions/service.action";
import { getTechnicianProfileById } from "@/actions/technician.action";
import { getMe } from "@/actions/auth.action";
import { getUserById } from "@/actions/user.action";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function BookingPage({ params }: PageProps) {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingPageContent params={params} />
    </Suspense>
  );
}

async function BookingPageContent({ params }: PageProps) {
  const { id } = await params;

  const serviceResponse = await getSingleService(id);

  if (!serviceResponse?.success || !serviceResponse.data?.result) {
    notFound();
  }

  const service = serviceResponse.data.result;

  const technicianResponse = await getTechnicianProfileById(
    service.technicianId,
  );

  if (!technicianResponse.success || !technicianResponse.data?.result) {
    notFound();
  }

  const technician = technicianResponse.data.result;

  const technicianNormalProfile = technician.userId
    ? await getUserById(technician.userId)
    : null;

  const meResponse = await getMe();

  const currentUser =
    meResponse.success && meResponse.data ? meResponse.data : null;

  const isCustomer = currentUser?.role === "CUSTOMER";

  return (
    <BookingForm
      service={service}
      technician={technician}
      technicianName={technicianNormalProfile?.data?.name}
      technicianProfilePicture={
        technicianNormalProfile?.data?.profilePicture ||
        "https://images.unsplash.com/photo-1740252117044-2af197eea287?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
      isCustomer={isCustomer}
    />
  );
}

function BookingPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}