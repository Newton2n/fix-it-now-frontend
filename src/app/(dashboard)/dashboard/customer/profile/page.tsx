import { Suspense } from "react";
import ProfilePage from "@/components/dashboard/profile-page";
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

  const user: UserProfile = {
    id: result.data.id,
    name: result.data.name,
    phoneNumber: result.data.phoneNumber ?? null,
    email: result.data.email,
    role: result.data.role,
    status: result.data.status,
    country: result.data.country ?? null,
    profilePicture: result.data.profilePicture ?? null,
    createdAt: result.data.createdAt,
    updatedAt: result.data.updatedAt,
  };

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