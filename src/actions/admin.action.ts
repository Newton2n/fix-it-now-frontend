"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import {
  CategoryInput,
  TechnicianStatusInput,
  UserStatusInput,
} from "@/schema/category/category.schema";

const backendUrl = process.env.BACKEND_API;

const emptyPaginatedResult = {
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

export const getAllCategory = async () => {
  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      data: emptyPaginatedResult,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/admin/categories`, {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 72,
        tags: ["all-category-admin"],
      },
      headers: {
        Cookie: `accessToken=${auth.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        data: emptyPaginatedResult,
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Operation completed successfully.",
      data: result.data?.result || emptyPaginatedResult,
    };
  } catch (error) {
    console.error("Get all categories error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: emptyPaginatedResult,
      errorDetails: [],
    };
  }
};

export const getAllPayments = async () => {
  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      data: emptyPaginatedResult,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/admin/payments`, {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 2,
        tags: ["all-payments-admin"],
      },
      headers: {
        Cookie: `accessToken=${auth.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        data: emptyPaginatedResult,
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Operation completed successfully.",
      data: result.data?.result || emptyPaginatedResult,
    };
  } catch (error) {
    console.error("Get all payments error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: emptyPaginatedResult,
      errorDetails: [],
    };
  }
};

export const getAllUser = async () => {
  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      data: emptyPaginatedResult,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/admin/users`, {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 2,
        tags: ["all-users-admin"],
      },
      headers: {
        Cookie: `accessToken=${auth.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        data: emptyPaginatedResult,
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Operation completed successfully.",
      data: result.data?.result || emptyPaginatedResult,
    };
  } catch (error) {
    console.error("Get all users error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: emptyPaginatedResult,
      errorDetails: [],
    };
  }
};

export const getAllBooking = async () => {
  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      data: {
        meta: {
          currentPage: 1,
          limit: 0,
          totalRow: 0,
          totalPage: 0,
        },
        data: [],
      },
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/admin/bookings`, {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 2,
        tags: ["all-bookings-admin"],
      },
      headers: {
        Cookie: `accessToken=${auth.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        data: {
          meta: {
            currentPage: 1,
            limit: 0,
            totalRow: 0,
            totalPage: 0,
          },
          data: [],
        },
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Operation completed successfully.",
      data: result.data?.result || {
        meta: {
          currentPage: 1,
          limit: 0,
          totalRow: 0,
          totalPage: 0,
        },
        data: [],
      },
    };
  } catch (error) {
    console.error("Get all bookings error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: {
        meta: {
          currentPage: 1,
          limit: 0,
          totalRow: 0,
          totalPage: 0,
        },
        data: [],
      },
      errorDetails: [],
    };
  }
};

export const getAllTechnicianProfile = async () => {
  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      data: {
        meta: { page: 1, limit: 0, totalRow: 0, totalPage: 0 },
        data: [],
      },
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/technicians`, {
      method: "GET",
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 12,
        tags: ["all-technician-admin"],
      },
      headers: {
        Cookie: `accessToken=${auth.accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        data: {
          meta: { page: 1, limit: 0, totalRow: 0, totalPage: 0 },
          data: [],
        },
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Operation completed successfully.",
      data: result.data?.result || {
        meta: { page: 1, limit: 0, totalRow: 0, totalPage: 0 },
        data: [],
      },
    };
  } catch (error) {
    console.error("Get all technician profiles error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: {
        meta: { page: 1, limit: 0, totalRow: 0, totalPage: 0 },
        data: [],
      },
      errorDetails: [],
    };
  }
};

// update technician status
export const updateTechnicianStatus = async (
  technicianId: string,
  data: TechnicianStatusInput,
) => {
  console.log("update technician profile admin", technicianId, data);
  if (!technicianId) {
    return {
      success: false,
      message: "Technician ID is required.",
      errorDetails: [],
    };
  }

  if (
    data.status !== "PENDING_APPROVAL" &&
    data.status !== "VERIFIED" &&
    data.status !== "SUSPENDED"
  ) {
    return {
      success: false,
      message: "Invalid technician status.",
      errorDetails: [],
    };
  }

  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(
      `${backendUrl}/api/technicians/admin/${technicianId}/verify`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${auth.accessToken}`,
        },
        body: JSON.stringify({
          status: data.status,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        errorDetails: result.errorDetails || [],
      };
    }

    revalidateTag("all-technician-admin", {
      expire: 0,
    });
    revalidateTag("all-technician-home", {
      expire: 0,
    });

    return {
      success: true,
      message:
        result.message ||
        `Technician status updated to ${data.status.toLowerCase()}.`,
      data: result.data,
    };
  } catch (error) {
    console.error("Update technician status error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

// Admin actions for verifying technicians
export const verifyTechnician = async (technicianId: string) =>
  updateTechnicianStatus(technicianId, { status: "VERIFIED" });

// Admin actions for unverifying  technicians
export const unverifyTechnician = async (technicianId: string) =>
  updateTechnicianStatus(technicianId, { status: "PENDING_APPROVAL" });

// Admin actions for suspending technicians
export const suspendTechnician = async (technicianId: string) =>
  updateTechnicianStatus(technicianId, { status: "SUSPENDED" });

export const updateUserStatus = async (
  userId: string,
  data: UserStatusInput,
) => {
  console.log("update user status in admin", userId, data);
  if (!userId) {
    return {
      success: false,
      message: "User ID is required.",
      errorDetails: [],
    };
  }

  if (data.status !== "ACTIVE" && data.status !== "BLOCKED") {
    return {
      success: false,
      message: "Invalid user status.",
      errorDetails: [],
    };
  }

  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${auth.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        errorDetails: result.errorDetails || [],
      };
    }

    // revalidate all users in admin dashboard
    revalidateTag("all-users-admin", {
      expire: 0,
    });
      //revalidating  admin technician details
    revalidateTag("all-technician-admin", { expire: 0 });

    return {
      success: true,
      message:
        result.message ||
        `User status updated to ${data.status.toLowerCase()}.`,
      data: result.data,
    };
  } catch (error) {
    console.error("Update user status error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const banUser = async (userId: string) =>
  updateUserStatus(userId, { status: "BLOCKED" });

export const unbanUser = async (userId: string) =>
  updateUserStatus(userId, { status: "ACTIVE" });

// create category
export const createCategory = async (data: CategoryInput) => {
  console.log("create category in admin", data);
  if (!data.name?.trim()) {
    return {
      success: false,
      message: "Category name is required.",
      errorDetails: [],
    };
  }

  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(`${backendUrl}/api/categories/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${auth.accessToken}`,
      },
      body: JSON.stringify({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        errorDetails: result.errorDetails || [],
      };
    }

    // revalidate all categories in admin dashboard
    revalidateTag("all-category-admin", {
      expire: 0,
    });
    // revalidate all categories in home page
    revalidateTag("all-category-home", {
      expire: 0,
    });

    return {
      success: true,
      message: result.message || "Category created successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Create category error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

//update category
export const updateCategory = async (
  categoryId: string,
  data: CategoryInput,
) => {
  console.log("update category in admin", categoryId, data);
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

  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(
      `${backendUrl}/api/categories/admin/${categoryId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${auth.accessToken}`,
        },
        body: JSON.stringify({
          name: data.name.trim(),
          description: data.description?.trim(),
        }),
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        errorDetails: result.errorDetails || [],
      };
    }

    // revalidate all categories in admin dashboard
    revalidateTag("all-category-admin", {
      expire: 0,
    });
    // revalidate all categories in home page
    revalidateTag("all-category-home", {
      expire: 0,
    });

    return {
      success: true,
      message: result.message || "Category updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update category error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const deleteCategory = async (categoryId: string) => {
  console.log("delete category in admin", categoryId);
  if (!categoryId) {
    return {
      success: false,
      message: "Category ID is required.",
      errorDetails: [],
    };
  }

  const auth = await getAdminToken();

  if (!auth.success || !auth.accessToken) {
    return {
      success: false,
      message: auth.message,
      errorDetails: [],
    };
  }

  try {
    const response = await fetch(
      `${backendUrl}/api/categories/admin/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          Cookie: `accessToken=${auth.accessToken}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "The request could not be completed.",
        errorDetails: result.errorDetails || [],
      };
    }

    // revalidate all categories in admin dashboard
    revalidateTag("all-category-admin", {
      expire: 0,
    });
    // revalidate all categories in home page
    revalidateTag("all-category-home", {
      expire: 0,
    });

    return {
      success: true,
      message: result.message || "Category deleted successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Delete category error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
