import { Suspense } from "react";
import { getMe } from "@/actions/auth.action";
import ProfilePage from "@/components/dashboard/profile-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfileContent />
    </Suspense>
  );
}

async function UserProfileContent() {
  const res = await getMe();
  const user = res.data;
  return <ProfilePage user={user} canEdit={true} />;
}

function ProfileSkeleton() {
  return <Skeleton className="h-100 w-full rounded-xl" />;
}