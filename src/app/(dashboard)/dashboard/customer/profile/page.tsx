import ProfilePage, { UserProfile } from "@/components/dashboard/profile-page";

const user: UserProfile = {
  id: "706059be-0a96-4dcf-86da-8046777b61dc",
  name: "Newton",
  phoneNumber: null,
  email: "2@gmail.com",
  role: "CUSTOMER",
  status: "ACTIVE",
  country: null,
  profilePicture: null,
  createdAt: "2026-07-08T06:12:00.598Z",
  updatedAt: "2026-07-11T11:09:11.035Z",
};

export default function CustomerProfilePage() {
  return <ProfilePage user={user} canEdit />;
}