"use server";

import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import type { ActionResponse, TechnicianProfile } from "@/types/api";

const backendUrl = process.env.BACKEND_API;

export const getTechnicianProfileById = async (
  id: string
): Promise<ActionResponse<TechnicianProfile>> => {
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
      cache: "no-store",
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to fetch technician profile.",
        errorDetails: result.errorDetails || [],
      };
    }
    return result;
  } catch (error) {
    console.error("Fetch technician profile error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const getLoginTechnicianProfile =
  async (): Promise<ActionResponse<TechnicianProfile>> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const verify = jwtUtils.verifyToken(
      accessToken as string,
      process.env.JWT_ACCESS_SECRET!
    );

    if (!verify.success || verify.data?.role !== "TECHNICIAN") {
      return {
        success: false,
        message: "You do not have permission to access this resource.",
        errorDetails: [],
      };
    }

    try {
      const res = await fetch(`${backendUrl}/api/technicians/profile`, {
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      });

      const result = await res.json();

      if (!result.success) {
        return {
          success: false,
          message:
            result.message || "Unable to fetch your technician profile.",
          errorDetails: result.errorDetails || [],
        };
      }
      return result;
    } catch (error) {
      console.error("Fetch login technician profile error:", error);

      return {
        success: false,
        message: "Unable to connect to the server. Please try again.",
        errorDetails: [],
      };
    }
  };

export const createTechnicianProfile = async (
  data: Partial<TechnicianProfile>
): Promise<ActionResponse<TechnicianProfile>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!
  );

  if (!verify.success || verify.data?.role !== "TECHNICIAN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/technicians/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message:
          result.message || "Unable to create technician profile.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Technician profile created successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Create technician profile error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const updateTechnicianProfile = async (
  data: Partial<TechnicianProfile>
): Promise<ActionResponse<TechnicianProfile>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!
  );

  if (!verify.success || verify.data?.role !== "TECHNICIAN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/technicians/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message:
          result.message || "Unable to update technician profile.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Technician profile updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update technician profile error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
