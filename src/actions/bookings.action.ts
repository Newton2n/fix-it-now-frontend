"use server";

import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import { getMe } from "./auth.action";

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

    console.log("All bookings by logged-in customer:", result);

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
      data: result.data?.bookings?.data || [],
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

//cancel booking by customer

export const cancelBooking = async (bookingId: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      errorDetails: [],
    };
  }

  try {
    // Get the currently authenticated user
    const userResult = await getMe();

    if (!userResult?.success || !userResult.data) {
      return {
        success: false,
        message: "Unable to verify your account.",
        errorDetails: [],
      };
    }

    const user = userResult.data;

    // Only customers can cancel bookings
    if (user.role !== "CUSTOMER") {
      return {
        success: false,
        message: "Only customers can cancel bookings.",
        errorDetails: [],
      };
    }

    // Get the booking first so we can verify ownership
    const bookingRes = await fetch(`${backendUrl}/api/booking/${bookingId}`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const bookingResult = await bookingRes.json();

    if (!bookingRes.ok || !bookingResult.success) {
      return {
        success: false,
        message: bookingResult.message || "Unable to retrieve booking.",
        errorDetails: bookingResult.errorDetails || [],
      };
    }

    const booking = bookingResult.data;

    // Verify this booking belongs to the logged-in customer
    if (booking.customerId !== user.id) {
      return {
        success: false,
        message: "You are not allowed to cancel this booking.",
        errorDetails: [],
      };
    }

    // Do not allow cancellation after the job has started
    if (booking.status === "IN_PROGRESS" || booking.status === "COMPLETED") {
      return {
        success: false,
        message: `This booking cannot be cancelled because it is already ${booking.status.toLowerCase().replace("_", " ")}.`,
        errorDetails: [],
      };
    }

    // Cancel the booking
    const cancelRes = await fetch(
      `${backendUrl}/api/booking/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const result = await cancelRes.json();

    if (!cancelRes.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to cancel booking.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Booking cancelled successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Cancel booking error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
