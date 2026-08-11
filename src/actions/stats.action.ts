"use server";

import {
  AdminDashboardData,
  AppStats,
  CustomerDashboardData,
  DashboardActionResponse,
  DashboardApiResponse,
  TechnicianDashboardData,
} from "@/types/stats";
import { getDashboardAuth } from "@/utils/dashboard-auth";
import { connection } from "next/server";

const backendUrl = process.env.BACKEND_API;

if (!backendUrl) {
  throw new Error("BACKEND_API is not configured.");
}

type StatsResponse = {
  success: boolean;
  message: string;
  data?: {
    result?: AppStats;
  };
};

//application stats summary
export const getAppStats = async (): Promise<{
  success: boolean;
  message: string;
  data: AppStats | null;
}> => {
  try {
    const response = await fetch(`${backendUrl}/api/stats/summary`, {
      method: "GET",
      cache: "force-cache",
      next: {
        tags: ["stats-summary"],
        revalidate: 60,
      },
    });

    const result: StatsResponse = await response.json();

    if (!response.ok || !result.success || !result.data?.result) {
      return {
        success: false,
        message:
          result.message || "Failed to retrieve application stats.",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data.result,
    };
  } catch (error) {
    console.error("getAppStats error:", error);

    return {
      success: false,
      message: "Failed to retrieve application statistics.",
      data: null,
    };
  }
};

//admin dashboard
export const getAdminDashboardStats = async (): Promise<
  DashboardActionResponse<AdminDashboardData>
> => {
  await connection();
  try {
    const auth = await getDashboardAuth();

    if (!auth.success) {
      return {
        success: false,
        message: auth.message,
        data: null,
      };
    }

    const response = await fetch(`${backendUrl}/api/stats/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      cache: "no-store",
    });

    let result: DashboardApiResponse<AdminDashboardData>;

    try {
      result =
        (await response.json()) as DashboardApiResponse<AdminDashboardData>;
    } catch {
      return {
        success: false,
        message: "Invalid response received from the server.",
        data: null,
      };
    }

    if (!response.ok || !result.success || !result.data?.result) {
      return {
        success: false,
        message:
          result.message ||
          "Failed to retrieve admin dashboard statistics.",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data.result,
    };
  } catch (error) {
    console.error("getAdminDashboardStats error:", error);

    return {
      success: false,
      message: "Failed to retrieve admin dashboard statistics.",
      data: null,
    };
  }
};
//technician dashboard
export const getTechnicianDashboardStats = async (): Promise<
  DashboardActionResponse<TechnicianDashboardData>
> => {
  await connection();
  try {
    const auth = await getDashboardAuth();

    if (!auth.success) {
      return {
        success: false,
        message: auth.message,
        data: null,
      };
    }

    const response = await fetch(`${backendUrl}/api/stats/technician`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      cache: "no-store",
    });

    let result: DashboardApiResponse<TechnicianDashboardData>;

    try {
      result =
        (await response.json()) as DashboardApiResponse<TechnicianDashboardData>;
    } catch {
      return {
        success: false,
        message: "Invalid response received from the server.",
        data: null,
      };
    }

    if (!response.ok || !result.success || !result.data?.result) {
      return {
        success: false,
        message:
          result.message ||
          "Failed to retrieve technician dashboard statistics.",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data.result,
    };
  } catch (error) {
    console.error("getTechnicianDashboardStats error:", error);

    return {
      success: false,
      message: "Failed to retrieve technician dashboard statistics.",
      data: null,
    };
  }
};

//customer dashboard 
export const getCustomerDashboardStats = async (): Promise<
  DashboardActionResponse<CustomerDashboardData>
> => {
  await connection();
  try {
    const auth = await getDashboardAuth();

    if (!auth.success) {
      return {
        success: false,
        message: auth.message,
        data: null,
      };
    }

    const response = await fetch(`${backendUrl}/api/stats/customer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      cache: "no-store",
    });

    let result: DashboardApiResponse<CustomerDashboardData>;

    try {
      result =
        (await response.json()) as DashboardApiResponse<CustomerDashboardData>;
    } catch {
      return {
        success: false,
        message: "Invalid response received from the server.",
        data: null,
      };
    }

    if (!response.ok || !result.success || !result.data?.result) {
      return {
        success: false,
        message:
          result.message ||
          "Failed to retrieve customer dashboard statistics.",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data.result,
    };
  } catch (error) {
    console.error("getCustomerDashboardStats error:", error);

    return {
      success: false,
      message: "Failed to retrieve customer dashboard statistics.",
      data: null,
    };
  }
};