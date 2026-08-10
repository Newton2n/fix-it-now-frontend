"use server";

import { AppStats } from "@/types/stats";

const backendUrl = process.env.BACKEND_API;


type StatsResponse = {
  success: boolean;
  message: string;
  data?: {
    result?: AppStats;
  };
};

export async function getAppStats(): Promise<{
  success: boolean;
  message: string;
  data: AppStats | null;
}> {
  try {
    

    const response = await fetch(`${backendUrl}/api/stats/summary`, {
      method: "GET",
      cache: "no-store",
    });

    const result: StatsResponse = await response.json();

    if (!response.ok || !result.success || !result.data?.result) {
      return {
        success: false,
        message: result.message || "Failed to retrieve application stats.",
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
}