"use server";

import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

export const getTechnicianProfileById = async (id: string) => {
  if (!id) {
    return { success: false, message: "technician id required" };
  }
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(`${backendUrl}/api/technicians/profile/${id}`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store"
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
