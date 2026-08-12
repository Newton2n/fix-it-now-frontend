"use server";

import { PaymentSearchParams } from "@/schema/payment/payment";
import {
  CreateCheckoutResponse,
  PaymentDetailsResponse,
} from "@/types/payment";
import { jwtUtils } from "@/utils/jwt";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

const emptyResponse = {
  data: [],
  meta: {
    currentPage: 1,
    limit: 10,
    totalRow: 0,
    totalPage: 0,
  },
};

//get login customer payment details  
export const getAllPaymentDetailsFromLoginUser = async (
  query: Partial<PaymentSearchParams> = {},
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      ...emptyResponse,
      errorDetails: [],
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
      errorDetails: [],
    };
  }

  try {
    const params = new URLSearchParams();

    // transactionId
    if (query.transactionId) {
      params.set("transactionId", query.transactionId);
    }

    // status
    if (query.status) {
      params.set("status", query.status);
    }

    // provider
    if (query.provider) {
      params.set("provider", query.provider);
    }

    // amount range
    if (query.minAmount !== undefined) {
      params.set("minAmount", String(query.minAmount));
    }
    if (query.maxAmount !== undefined) {
      params.set("maxAmount", String(query.maxAmount));
    }

    // pagination & sorting
    params.set("page", String(query.page ?? 1));
    params.set("limit", String(query.limit ?? 10));
    params.set("sortBy", query.sortBy ?? "createdAt");
    params.set("sortOrder", query.sortOrder ?? "desc");

    const res = await fetch(`${backendUrl}/api/payment?${params.toString()}`, {
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
      errorDetails: [],
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

    //revalidate admin payment
    revalidateTag("all-payments-admin", {
      expire: 0,
    });
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

    const res = await fetch(`${backendUrl}/api/payment/${bookingId}`, {
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
