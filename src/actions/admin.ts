"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;
export const getAllCategory = async () => {
  const cookieStore = await cookies();

  console.log("cookie store", cookieStore);
  const accessToken = cookieStore.get("accessToken")?.value;
  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success && verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "sorry you are have no permission",
    };
  }
  const res = await fetch(`${backendUrl}/api/admin/categories`, {
    cache: "force-cache",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-service-by-login-Technician"],
    },
  });
  const result = await res.json();
  console.log("get all category admin", result);
  if (result.success) {
    return result;
  }
};
