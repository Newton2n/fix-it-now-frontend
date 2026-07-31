"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

export const getAllPaymentDetailsFromLoginUser = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  const emptyResponse = {
    data: [],
    meta: {
      currentPage: 1,
      limit: 10,
      totalRow: 0,
      totalPage: 0,
    },
  };

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      ...emptyResponse,
    };
  }

  const verifyAccessToken = jwtUtils.verifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET!,
  );

  if (!verifyAccessToken.success) {
    return {
      success: false,
      message: "Your session is invalid or expired.",
      ...emptyResponse,
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/payment`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    console.log("Payment response:", result);

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to load payment history.",
        ...emptyResponse,
        errorDetails: result.errorDetails || [],
      };
    }

    const paymentResult = result.data?.result;

    return {
      success: true,
      message: result.message || "Payment history retrieved successfully.",
      data: paymentResult?.data || [],
      meta: paymentResult?.meta || emptyResponse.meta,
    };
  } catch (error) {
    console.error("Get user payment history error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      ...emptyResponse,
      errorDetails: [],
    };
  }
};

