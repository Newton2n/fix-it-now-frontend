import { getMe } from "@/actions/auth.action";
import ProfilePage, { UserProfile } from "@/components/dashboard/profile-page";

export default async function AdminProfilePage() {
  const res = await getMe();
  const user = res.data;
  return <ProfilePage user={user} canEdit={true} />;
}
