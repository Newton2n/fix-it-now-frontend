"use server";
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
export const getAllServiceByCategoryId = async (id: string) => {
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
export const getAllServiceByLoginTechnician = async () => {
  const cookieStore = await cookies();

  console.log("cookie store", cookieStore);
  const accessToken = cookieStore.get("accessToken")?.value;
  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success && verify.data?.role !== "TECHNICIAN") {
    return {
      success: false,
      message: "sorry you are have no permission",
    };
  }
  const res = await fetch(`${backendUrl}/api/technicians/services`, {
    cache: "force-cache",
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    next: {
      revalidate: 60 * 60 * 2,
      tags: ["all-service-by-login-Technician"],
    },
  });
  const result = await res.json();
  console.log("get all service from login in technician response", result);
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

  console.log("cookie store", cookieStore);
  const accessToken = cookieStore.get("accessToken")?.value;
  console.log("accessToken", accessToken);

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
    },
  });
  const result = await res.json();
  console.log("single service response", result);
  if (result.success) {
    return result;
  }
};

export const createService = async (data: any) => {
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
    const res = await fetch(`${backendUrl}/api/service`, {
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
        message: result.message || "Unable to create service.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Service created successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Create service error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const updateService = async (id: string, data: any) => {
  if (!id) {
    return {
      success: false,
      message: "Service id required",
    };
  }

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
    const res = await fetch(`${backendUrl}/api/service/${id}`, {
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
        message: result.message || "Unable to update service.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Service updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update service error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const deleteService = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Service id required",
    };
  }

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
    const res = await fetch(`${backendUrl}/api/service/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to delete service.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Service deleted successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Delete service error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
