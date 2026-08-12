"use server";

import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import type { ActionResponse } from "@/types/api";
import type { TechnicianProfile } from "@/types/technician";
import {
  TChangeAvailabilityPayload,
  TCreateTechnicianProfile,
} from "@/types/technician";
import { revalidateTag } from "next/cache";
import { connection } from "next/server";

const backendUrl = process.env.BACKEND_API;

// get technician profile by id
export const getTechnicianProfileById = async (id: string) => {
  if (!id) {
    return { success: false, message: "technician id required" };
  }


  try {
    const res = await fetch(`${backendUrl}/api/technicians/profile/${id}`, {
      method:"GET",
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
    

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

// get log in technician profile
export const getLoginTechnicianProfile = async () => {
  await connection();
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
      cache: "no-store",
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
    //revalidating  home page
    revalidateTag("all-technician-home", { expire: 0 });
    //revalidating  admin technician details
    revalidateTag("all-technician-admin", { expire: 0 });

    return {
      success: true,
      message: "Technician profile created successfully.",
      data: result.data,
    };
  } catch (error) {
   

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

//update technician profile

export const updateTechnicianProfile = async (data: {
  bio: string;
  skills: string[];
  serviceArea: string[];
  yearsOfExperience: number;
}): Promise<ActionResponse<TechnicianProfile>> => {
  
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
    //revalidating  home page
    revalidateTag("all-technician-home", { expire: 0 });
    //revalidating  admin technician details
    revalidateTag("all-technician-admin", { expire: 0 });

    return {
      success: true,
      message: "Technician profile updated successfully.",
      data: result.data,
    };
  } catch (error) {
  

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

  

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to update technician availability.",
        errorDetails: result.errorDetails || [],
      };
    }

    //revalidating  home page
    revalidateTag("all-technician-home", { expire: 0 });

    //revalidating  admin technician details
    revalidateTag("all-technician-admin", { expire: 0 });

    return {
      success: true,
      message:
        result.message || "Technician availability updated successfully.",
      data: result.data,
    };
  } catch (error) {
  

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

type TechnicianFilters = {
  search?: string;
  page?: number;
  limit?: number;
  minExperience?: number;
  isAvailable?: string;
  skills?: string;
  serviceArea?: string;
  sortBy?: "experience" | "date";
  sortOrder?: "asc" | "desc";
};

//get all technician public

export const getAllTechnicians = async (filters: TechnicianFilters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.page) {
      params.set("page", String(filters.page));
    }

    if (filters.limit) {
      params.set("limit", String(filters.limit));
    }

    if (filters.minExperience !== undefined) {
      params.set("minExperience", String(filters.minExperience));
    }

    if (filters.isAvailable) {
      params.set("isAvailable", filters.isAvailable);
    }

    if (filters.skills) {
      params.set("skills", filters.skills);
    }

    if (filters.serviceArea) {
      params.set("serviceArea", filters.serviceArea);
    }

    if (filters.sortBy) {
      params.set("sortBy", filters.sortBy);
    }

    if (filters.sortOrder) {
      params.set("sortOrder", filters.sortOrder);
    }

    const url = `${backendUrl}/api/technicians?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "force-cache",
      next: {
        tags: ["all-technician-home"],
        revalidate: 60 * 60 * 12,
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to fetch technicians.",
        data: [],
        meta: {
          page: 1,
          limit: 10,
          totalRow: 0,
          totalPage: 0,
        },
      };
    }

    return {
      success: true,
      message: result.message || "Technicians retrieved successfully.",
      data: result.data?.result?.data || [],
      meta: result.data?.result?.meta || {
        page: 1,
        limit: 10,
        totalRow: 0,
        totalPage: 0,
      },
    };
  } catch (error) {
   

    return {
      success: false,
      message: "Unable to connect to the server.",
      data: [],
      meta: {
        page: 1,
        limit: 10,
        totalRow: 0,
        totalPage: 0,
      },
    };
  }
};
