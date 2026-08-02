import { Suspense } from "react";
import { getMe } from "@/actions/auth.action";
import ProfilePage from "@/components/dashboard/profile-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicianNormalProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <TechnicianProfileContent />
    </Suspense>
  );
}

async function TechnicianProfileContent() {
  const res = await getMe();
  const user = res.data;
  return <ProfilePage user={user} canEdit={true} />;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-100 w-full rounded-xl" />
    </div>
  );
}