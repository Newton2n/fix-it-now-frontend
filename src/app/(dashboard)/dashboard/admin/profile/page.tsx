import ProfilePage, { UserProfile } from "@/components/dashboard/profile-page";

const user: UserProfile = {
  id: "b3a0f3c2-9999-4f44-8f77-222222222222",
  name: "Admin User",
  phoneNumber: null,
  email: "admin@gmail.com",
  role: "ADMIN",
  status: "ACTIVE",
  country: null,
  profilePicture: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-07-20T10:00:00.000Z",
};

export default function AdminProfilePage() {
  return <ProfilePage user={user} canEdit={false} />;
}