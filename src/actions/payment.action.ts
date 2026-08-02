"use server";

import {
  CreateCheckoutResponse,
  PaymentDetailsResponse,
} from "@/types/payment";
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

// Create a checkout session for a specific booking
export const createCheckoutSession = async (
  bookingId: string,
): Promise<CreateCheckoutResponse> => {
  console.log("checkout payload", bookingId);
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "You are not logged in.",
        errorDetails: [],
      };
    }

    const res = await fetch(`${backendUrl}/api/payment/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
        cache: "no-store",
      },
      body: JSON.stringify({
        bookingId,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to create checkout session.",
        errorDetails: result.errorDetails || [],
      };
    }
    console.log("checkout response", result);
    return {
      success: true,
      message: result.message || "Checkout session created",
      data: {
        checkoutUrl: result.data.checkoutUrl,
      },
    };
  } catch (error) {
    console.error("Create checkout session error:", error);

    return {
      success: false,
      message: "Unable to connect to the payment server.",
      errorDetails: [],
    };
  }
};

// Get payment details for a specific booking
export const getPaymentDetailsByBookingId = async (
  bookingId: string,
): Promise<PaymentDetailsResponse> => {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "You are not logged in.",
        errorDetails: [],
      };
    }

    const res = await fetch(`${backendUrl}/api/payment/booking/${bookingId}`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to load payment details.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Payment details retrieved successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Get payment details error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
