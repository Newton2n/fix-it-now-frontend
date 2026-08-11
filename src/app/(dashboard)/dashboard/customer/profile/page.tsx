import { Suspense } from "react";
import ProfilePage from "@/components/profile/profile-page";
import { getMe } from "@/actions/auth.action";
import { UserProfile } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <CustomerProfileContent />
    </Suspense>
  );
}

async function CustomerProfileContent() {
  const result = await getMe();

  if (!result.success || !result.data) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Unable to load your profile.
        </p>
      </div>
    );
  }

  const user = result.data;

  return <ProfilePage user={user} canEdit />;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-100 w-full rounded-xl" />
    </div>
  );
}
