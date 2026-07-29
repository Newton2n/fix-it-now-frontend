"use server"
import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;
export const getAllService = async () => {
  const res = await fetch(`${backendUrl}/api/service`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 4,
      tags: ["all-service"],
    },
  });
  const result = await res.json();
  if (result.success) {
    return result;
  }
};
export const getAllServiceByCategoryId = async (id:string) => {
  const res = await fetch(`${backendUrl}/api/service/category/${id}`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-service-by-category"],
    },
  });
  const result = await res.json();
  if (result.success) {
    return result;
  }
};

export const getSingleService = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Service id required",
    };
  }
  const cookieStore = await cookies();

  console.log("cookie store",cookieStore)
  const accessToken = cookieStore.get("accessToken")?.value;
  console.log("accessToken",accessToken)

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

  const res = await fetch(`${backendUrl}/api/service/${id}`, {
    cache: "no-store",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    }
  });
  const result = await res.json();
  console.log("single service response",result)
  if (result.success) {
    return result;
  }
};
