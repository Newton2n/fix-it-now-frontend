"use server";

import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import type { ActionResponse} from "@/types/api";
import type { TechnicianProfile } from "@/types/technician";
import {
  TChangeAvailabilityPayload,
  TCreateTechnicianProfile,
} from "@/types/technician";
import { revalidateTag } from "next/cache";

const backendUrl = process.env.BACKEND_API;

// get technician profile by id
export const getTechnicianProfileById = async (
  id: string,
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

// get log in technician profile
export const getLoginTechnicianProfile = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );

  if (!verify.success || verify.data?.role !== "TECHNICIAN") {
    return {
      success: false,
      message: "You do not have permission to access this resource.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/technicians/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "force-cache",
      next: {
        tags: ["login-technician"],
        revalidate: 60 * 60 * 24,
      },
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to fetch your technician profile.",
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

// create technician profile
export const createTechnicianProfile = async (
  data: TCreateTechnicianProfile,
): Promise<ActionResponse<TCreateTechnicianProfile>> => {
  console.log("technician profile creation payload", data);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
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
        message: result.message || "Unable to create technician profile.",
        errorDetails: result.errorDetails || [],
      };
    }
    //revalidate log in technician action
    revalidateTag("login-technician", {
      expire: 0,
    });

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

//update technician profile

export const updateTechnicianProfile = async (
  data: Omit<TechnicianProfile, "availability">,
): Promise<ActionResponse<TechnicianProfile>> => {
  console.log("update technician profile payload", data);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
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
        message: result.message || "Unable to update technician profile.",
        errorDetails: result.errorDetails || [],
      };
    }

    //revalidate log in technician action
    revalidateTag("login-technician", {
      expire: 0,
    });
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

//update availability
export const updateTechnicianAvailability = async (
  payload: TChangeAvailabilityPayload,
): Promise<ActionResponse<TechnicianProfile>> => {
  console.log("update technician availability", payload);
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

  if (!verify.success || verify.data?.role !== "TECHNICIAN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/technicians/availability`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    console.log("update technician availability result", result);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to update technician availability.",
        errorDetails: result.errorDetails || [],
      };
    }
    //revalidate log in technician action
    revalidateTag("login-technician", {
      expire: 0,
    });
    return {
      success: true,
      message:
        result.message || "Technician availability updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update technician availability error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
