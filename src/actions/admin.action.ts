"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import { PaginatedResult } from "@/types/admin";
import { Booking } from "@/schema/booking/booking.schema";
import { TechnicianProfile } from "@/types/api";

const backendUrl = process.env.BACKEND_API;

if (!backendUrl) {
  throw new Error("BACKEND_API environment variable is not configured.");
}

type UserStatus = "ACTIVE" | "INACTIVE";

type CategoryInput = {
  name: string;
  description?: string;
};

type UserStatusInput = {
  status: UserStatus;
};

type AdminResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errorDetails?: unknown[];
};

const emptyResult = {
  meta: {
    currentPage: 1,
    limit: 10,
    totalRow: 0,
    totalPage: 0,
  },
  data: [],
};

async function getAdminToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      accessToken: null,
    };
  }

  const verify = jwtUtils.verifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET!,
  );

  if (!verify.success) {
    return {
      success: false,
      message: "Your session is invalid or expired.",
      accessToken: null,
    };
  }

  if (verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      accessToken: null,
    };
  }

  return {
    success: true,
    message: "Authorized.",
    accessToken,
  };
}

async function adminFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<AdminResponse<T | null>> {
  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      data: null,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Cookie: `accessToken=${auth.accessToken}`,
      },
    });

    let result;

    try {
      result = await response.json();
    } catch {
      return {
        success: false,
        message: "Invalid response received from the server.",
        data: null,
        errorDetails: [],
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        data: null,
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Operation completed successfully.",
      data: result.data,
      errorDetails: result.errorDetails || [],
    };
  } catch (error) {
    console.error(`Admin API error: ${endpoint}`, error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: null,
      errorDetails: [],
    };
  }
}

export const getAllCategory = async () => {
  const result = await adminFetch<{
    result: typeof emptyResult;
  }>("/api/admin/categories", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-category-admin"],
    },
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: emptyResult,
      errorDetails: result.errorDetails,
    };
  }

  return {
    success: true,
    message: result.message,
    data: result.data?.result || emptyResult,
  };
};

export const getAllPayments = async () => {
  const result = await adminFetch<{
    result: typeof emptyResult;
  }>("/api/admin/payments", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-payments-admin"],
    },
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: emptyResult,
      errorDetails: result.errorDetails,
    };
  }

  return {
    success: true,
    message: result.message,
    data: result.data?.result || emptyResult,
  };
};

export const getAllUser = async () => {
  const result = await adminFetch<{
    result: typeof emptyResult;
  }>("/api/admin/users", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-users-admin"],
    },
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: emptyResult,
      errorDetails: result.errorDetails,
    };
  }

  return {
    success: true,
    message: result.message,
    data: result.data?.result || emptyResult,
  };
};

export const getAllBooking = async () => {
  const result = await adminFetch<{
    result: {
      meta: {
        currentPage: number;
        limit: number;
        totalRow: number;
        totalPage: number;
      };
      data: Booking[];
    };
  }>("/api/admin/bookings", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-bookings-admin"],
    },
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: {
        meta: {
          currentPage: 1,
          limit: 0,
          totalRow: 0,
          totalPage: 0,
        },
        data: [],
      },
      errorDetails: result.errorDetails,
    };
  }

  return {
    success: true,
    message: result.message,
    data: result.data?.result ?? {
      meta: {
        currentPage: 1,
        limit: 0,
        totalRow: 0,
        totalPage: 0,
      },
      data: [],
    },
  };
};



export const getAllTechnicianProfile = async () => {
  const result = await adminFetch<{
    result: PaginatedResult<TechnicianProfile>;
  }>("/api/technicians", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-technician-admin"],
    },
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message,
      data: {
        meta: { page: 1, limit: 0, totalRow: 0, totalPage: 0 },
        data: [],
      },
      errorDetails: result.errorDetails,
    };
  }

  return {
    success: true,
    message: result.message,
    data: result.data?.result ?? {
      meta: { page: 1, limit: 0, totalRow: 0, totalPage: 0 },
      data: [],
    },
  };
};

type TechnicianStatus = "PENDING" | "VERIFIED" | "SUSPENDED";

type TechnicianStatusInput = {
  status: TechnicianStatus;
};

export const updateTechnicianStatus = async (
  technicianId: string,
  data: TechnicianStatusInput,
) => {
  if (!technicianId) {
    return {
      success: false,
      message: "Technician ID is required.",
      errorDetails: [],
    };
  }

  if (
    data.status !== "PENDING" &&
    data.status !== "VERIFIED" &&
    data.status !== "SUSPENDED"
  ) {
    return {
      success: false,
      message: "Invalid technician status.",
      errorDetails: [],
    };
  }

  const result = await adminFetch(
    `/api/technicians/admin/${technicianId}/verify`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: data.status,
      }),
    },
  );

  if (!result.success) {
    return result;
  }

  revalidateTag("all-technician-admin", "max");

  return {
    success: true,
    message: result.message || `Technician status updated to ${data.status.toLowerCase()}.`,
    data: result.data,
  };
};

export const verifyTechnician = async(technicianId: string) =>
  updateTechnicianStatus(technicianId, { status: "VERIFIED" });

export const unverifyTechnician = async(technicianId: string) =>
  updateTechnicianStatus(technicianId, { status: "PENDING" });

export const suspendTechnician = async(technicianId: string) =>
  updateTechnicianStatus(technicianId, { status: "SUSPENDED" });


export const updateUserStatus = async (
  userId: string,
  data: UserStatusInput,
) => {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required.",
      errorDetails: [],
    };
  }

  if (data.status !== "ACTIVE" && data.status !== "INACTIVE") {
    return {
      success: false,
      message: "Invalid user status.",
      errorDetails: [],
    };
  }

  const result = await adminFetch(`/api/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!result.success) {
    return result;
  }

  revalidateTag("all-users-admin", "max");

  return {
    success: true,
    message:
      result.message || `User status updated to ${data.status.toLowerCase()}.`,
    data: result.data,
  };
};

export const banUser = async (userId: string) => {
  return updateUserStatus(userId, {
    status: "INACTIVE",
  });
};

export const unbanUser = async (userId: string) => {
  return updateUserStatus(userId, {
    status: "ACTIVE",
  });
};

export const createCategory = async (data: CategoryInput) => {
  if (!data.name?.trim()) {
    return {
      success: false,
      message: "Category name is required.",
      errorDetails: [],
    };
  }

  const result = await adminFetch("/api/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    }),
  });

  if (!result.success) {
    return result;
  }

  revalidateTag("all-category-admin", "max");

  return {
    success: true,
    message: result.message || "Category created successfully.",
    data: result.data,
  };
};

export const updateCategory = async (
  categoryId: string,
  data: CategoryInput,
) => {
  if (!categoryId) {
    return {
      success: false,
      message: "Category ID is required.",
      errorDetails: [],
    };
  }

  if (!data.name?.trim()) {
    return {
      success: false,
      message: "Category name is required.",
      errorDetails: [],
    };
  }

  const result = await adminFetch(`/api/category/${categoryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    }),
  });

  if (!result.success) {
    return result;
  }

  revalidateTag("all-category-admin", "max");

  return {
    success: true,
    message: result.message || "Category updated successfully.",
    data: result.data,
  };
};

export const deleteCategory = async (categoryId: string) => {
  if (!categoryId) {
    return {
      success: false,
      message: "Category ID is required.",
      errorDetails: [],
    };
  }

  const result = await adminFetch(`/api/category/${categoryId}`, {
    method: "DELETE",
  });

  if (!result.success) {
    return result;
  }

  revalidateTag("all-category-admin", "max");

  return {
    success: true,
    message: result.message || "Category deleted successfully.",
    data: result.data,
  };
};
