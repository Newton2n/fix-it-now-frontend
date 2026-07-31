"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

export const getAllReviewDetailsFromLoginUser = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      data: [],
      meta: {
        currentPage: 1,
        limit: 10,
        totalRow: 0,
        totalPage: 0,
      },
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
      data: [],
      meta: {
        currentPage: 1,
        limit: 10,
        totalRow: 0,
        totalPage: 0,
      },
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/review/me`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    console.log("Review response:", result);

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to load reviews.",
        data: [],
        meta: {
          currentPage: 1,
          limit: 10,
          totalRow: 0,
          totalPage: 0,
        },
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Reviews fetched successfully.",
      data: result.data?.result?.data || [],
      meta: result.data?.result?.meta || {
        currentPage: 1,
        limit: 10,
        totalRow: 0,
        totalPage: 0,
      },
    };
  } catch (error) {
    console.error("Get user reviews error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: [],
      meta: {
        currentPage: 1,
        limit: 10,
        totalRow: 0,
        totalPage: 0,
      },
      errorDetails: [],
    };
  }
};

export const submitReview = async (data: {
  bookingId: string;
  rating: number;
  description: string;
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success) {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/review`, {
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
        message: result.message || "Unable to submit review.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Review submitted successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Submit review error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const updateReview = async (
  reviewId: string,
  data: {
    rating: number;
    description: string;
  },
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success) {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/review/${reviewId}`, {
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
        message: result.message || "Unable to update review.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Review updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update review error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const deleteReview = async (reviewId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );
  if (!verify.success) {
    return {
      success: false,
      message: "You do not have permission to perform this action.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/review/${reviewId}`, {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to delete review.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Review deleted successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Delete review error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
