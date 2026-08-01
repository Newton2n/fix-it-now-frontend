import { notFound } from "next/navigation";

import BookingForm from "@/components/booking/booking-form";
import { getSingleService } from "@/actions/service.action";
import { getTechnicianProfileById } from "@/actions/technician.action";
import { getMe } from "@/actions/auth.action";
import { getUserById } from "@/actions/user.action";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { id } = await params;

  const serviceResponse = await getSingleService(id);

  if (!serviceResponse?.success || !serviceResponse.data?.result) {
    notFound();
  }

  const service = serviceResponse.data.result;

  const technicianResponse = await getTechnicianProfileById(
    service.technicianId,
  );

  const technicianNormalProfile = technicianResponse.data.result.userId
    ? await getUserById(technicianResponse.data.result.userId)
    : null;

  console.log("technicianResponse", technicianResponse);
  if (!technicianResponse.success || !technicianResponse.data?.result) {
    notFound();
  }

  const technician = technicianResponse.data.result;

  const meResponse = await getMe();

  const currentUser =
    meResponse.success && meResponse.data ? meResponse.data : null;

  const isCustomer = currentUser?.role === "CUSTOMER";

  return (
    <BookingForm
      service={service}
      technician={technician}
      technicianName={technicianNormalProfile?.data.name}
      technicianProfilePicture={
        technicianNormalProfile?.data.profilePicture ||
        "https://images.unsplash.com/photo-1740252117044-2af197eea287?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
      isCustomer={isCustomer}
    />
  );
}
