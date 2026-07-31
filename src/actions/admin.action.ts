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
      tags: ["all-category-admin"],
    },
  });
  const result = await res.json();
  console.log("get all category admin", result);
  if (result.success) {
    return result;
  }
};
export const getAllPayments = async () => {
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
  const res = await fetch(`${backendUrl}/api/admin/payments`, {
    cache: "force-cache",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-payments-admin"],
    },
  });
  const result = await res.json();
  console.log("get all payments admin", result);
  if (result.success) {
    return result;
  }
};
export const getAllUser = async () => {
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
  const res = await fetch(`${backendUrl}/api/admin/users`, {
    cache: "force-cache",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-users-admin"],
    },
  });
  const result = await res.json();
  console.log("get all users admin", result);
  if (result.success) {
    return result;
  }
};
export const getAllBooking = async () => {
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
  const res = await fetch(`${backendUrl}/api/admin/bookings`, {
    cache: "force-cache",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-bookings-admin"],
    },
  });
  const result = await res.json();
  console.log("get all bookings admin", result);
  if (result.success) {
    return result;
  }
};
export const getAllTechnicianProfile = async () => {
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
  const res = await fetch(`${backendUrl}/api/technicians`, {
    cache: "force-cache",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-technician-admin"],
    },
  });
  const result = await res.json();
  console.log("get all bookings admin", result);
  if (result.success) {
    return result;
  }
};

// Technician Verification Actions
export const verifyTechnician = async (technicianId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success || verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(
      `${backendUrl}/api/admin/technicians/${technicianId}/verify`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to verify technician.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Technician verified successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Verify technician error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const unverifyTechnician = async (technicianId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success || verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(
      `${backendUrl}/api/admin/technicians/${technicianId}/unverify`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to unverify technician.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Technician unverified successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Unverify technician error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

// User Ban Actions
export const banUser = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success || verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(
      `${backendUrl}/api/admin/users/${userId}/ban`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to ban user.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "User banned successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Ban user error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const unbanUser = async (userId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success || verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(
      `${backendUrl}/api/admin/users/${userId}/unban`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to unban user.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "User unbanned successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Unban user error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

// Category CRUD Actions
export const createCategory = async (data: { name: string; description?: string }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success || verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/category`, {
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
        message: result.message || "Unable to create category.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Category created successfully.",
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

export const updateCategory = async (
  categoryId: string,
  data: { name: string; description?: string }
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success || verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/category/${categoryId}`, {
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
        message: result.message || "Unable to update category.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Category updated successfully.",
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
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success || verify.data?.role !== "ADMIN") {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/category/${categoryId}`, {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to delete category.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Category deleted successfully.",
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
