import ProfilePage, {
  type UserProfile,
} from "@/components/dashboard/profile-page";
import { getMe } from "@/actions/auth.action";

export default async function CustomerProfilePage() {
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