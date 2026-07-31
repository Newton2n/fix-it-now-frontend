"use server";

import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";

const backendUrl = process.env.BACKEND_API;

type TechnicianBookingStatus =
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "COMPLETED";

//  Get bookings for the currently logged-in customer.

export const getAllBookingsFromLoginUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      data: [],
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
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/booking`, {
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
        message: result.message || "Unable to load bookings.",
        data: [],
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Bookings fetched successfully.",
      data: result.data?.bookings || [],
    };
  } catch (error) {
    console.error("Get user bookings error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: [],
      errorDetails: [],
    };
  }
};

// Get bookings assigned to the currently logged-in technician.

export const getAllBookingsFromLoginTechnician = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      data: [],
    };
  }

  const verify = jwtUtils.verifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET!,
  );

  if (!verify.success || verify.data?.role !== "TECHNICIAN") {
    return {
      success: false,
      message: "You do not have permission to view these bookings.",
      data: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/technicians/bookings`, {
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
        message: result.message || "Unable to load bookings.",
        data: [],
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Bookings fetched successfully.",
      data: result.data || [],
    };
  } catch (error) {
    console.error("Get technician bookings error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: [],
      errorDetails: [],
    };
  }
};

// Update booking status for the currently logged-in technician.

// REQUESTED → ACCEPTED
// REQUESTED → DECLINED
// PAID → IN_PROGRESS
// IN_PROGRESS → COMPLETED

export const updateTechnicianBookingStatus = async (
  bookingId: string,
  status: TechnicianBookingStatus,
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      errorDetails: [],
    };
  }

  const verify = jwtUtils.verifyToken(
    accessToken,
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
    const res = await fetch(`${backendUrl}/api/booking/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({
        status,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to update booking.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Booking updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update technician booking status error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
