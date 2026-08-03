"use server";

import { userUpdateSchema } from "@/schema/user/user.schema";
import { TUpdateUser } from "@/types/user";
import { jwtUtils } from "@/utils/jwt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;
export const getUserById = async (id: string) => {
  if (!id) {
    return { success: false, message: "User id required" };
  }
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(`${backendUrl}/api/user/${id}`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Invalid credentials.",
        errorDetails: result.errorDetails || [],
      };
    }
    return result;
  } catch (error) {
    console.error("Login action error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

//update normal user profile
export const updateNormalProfile = async (id: string, payload: TUpdateUser) => {
  if (!id) {
    return {
      success: false,
      message: "User id required",
      errorDetails: [],
    };
  }

  console.log("update user profile payload", payload);

  const parsed = userUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid profile data.",
      errorDetails: parsed.error.issues,
    };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      errorDetails: [],
    };
  }

  const verify = jwtUtils.verifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET!,
  );

  if (!verify.success) {
    return {
      success: false,
      message: "You do not have permission to access this resource.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({
        ...parsed.data,
      }),
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to update user profile.",
        errorDetails: result.errorDetails || [],
      };
    }

    revalidateTag("all-users-admin", {
      expire: 0,
    });
    return {
      success: true,
      message: result.message || "User profile updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update user profile error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
