"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

export const getAllReviewDetailsFromLoginUser = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  const verifyAccessToken = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verifyAccessToken.success) {
    return {
      success: false,
      message: "sorry you are not log in",
    };
  }

  const res = await fetch(`${backendUrl}/api/review/me`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "force-cache",
    next: {
      tags: ["user-payments"],
      revalidate: 60 * 60 * 24,
    },
  });
  const result = await res.json();
  console.log("review response", result);
  if (result.success) {
    return result.data.result;
  }
};
