import { getMe } from "@/actions/auth.action";
import Navbar from "./navbar";

export default async function AuthNavbar() {
  const user = await getMe();

  return (
    <Navbar
      role={user?.data?.role ?? null}
      userName={user?.data?.name}
    />
  );
}