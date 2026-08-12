"use server";

import { cookies } from "next/headers";
import { jwtUtils } from "@/utils/jwt";
import { getMe } from "./auth.action";
import { ActionResponse } from "@/types/api";
import { GetBookingDetailsResponse } from "@/types/booking";
import { revalidateTag } from "next/cache";
import { UserBookingSearchParams } from "@/schema/booking/booking.schema";

const backendUrl = process.env.BACKEND_API;

type TechnicianBookingStatus =
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "COMPLETED";

// get all booking by login user
export const getAllBookingsFromLoginUser = async (
  query: Partial<UserBookingSearchParams> = {},
) => {
  console.log("user booking search param",query)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
      data: {
        meta: {
          currentPage: 1,
          limit: query.limit ?? 15,
          totalRow: 0,
          totalPage: 0,
        },
        data: [],
      },
      errorDetails: [],
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
      data: {
        meta: {
          currentPage: 1,
          limit: query.limit ?? 15,
          totalRow: 0,
          totalPage: 0,
        },
        data: [],
      },
      errorDetails: [],
    };
  }

  try {
    const params = new URLSearchParams();

    if (query.status) {
      params.set("status", query.status);
    }

    if (query.paymentStatus) {
      params.set("paymentStatus", query.paymentStatus);
    }

    if (query.serviceId) {
      params.set("serviceId", query.serviceId);
    }

    if (query.startDate) {
      params.set("startDate", query.startDate.toISOString());
    }

    if (query.endDate) {
      params.set("endDate", query.endDate.toISOString());
    }

    params.set("page", String(query.page ?? 1));
    params.set("limit", String(query.limit ?? 10));
    params.set("sortBy", query.sortBy ?? "createdAt");
    params.set("sortOrder", query.sortOrder ?? "desc");

    const res = await fetch(`${backendUrl}/api/booking?${params.toString()}`, {
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
        data: {
          meta: {
            currentPage: query.page ?? 1,
            limit: query.limit ?? 15,
            totalRow: 0,
            totalPage: 0,
          },
          data: [],
        },
        errorDetails: result.errorDetails || [],
      };
    }

    const bookingsResult = result.data?.bookings ?? {
      meta: {
        currentPage: query.page ?? 1,
        limit: query.limit ?? 10,
        totalRow: 0,
        totalPage: 0,
      },
      data: [],
    };
    console.log(query,"user booking search result",bookingsResult)
    return {
      success: true,
      message: result.message || "Bookings fetched successfully.",
      data: bookingsResult,
      errorDetails: [],
    };
  } catch (error) {
    console.error("Get user bookings error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: {
        meta: {
          currentPage: query.page ?? 1,
          limit: query.limit ?? 15,
          totalRow: 0,
          totalPage: 0,
        },
        data: [],
      },
      errorDetails: [],
    };
  }
};

// Get bookings assigned to the currently logged-in technician.

export const getAllBookingsFromLoginTechnician = async (
  query: Partial<UserBookingSearchParams> = {},
) => {
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
      message: "You do not have permission to view these bookings.",
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

  try {
    const params = new URLSearchParams();

    if (query.status) params.set("status", query.status);
    if (query.paymentStatus) params.set("paymentStatus", query.paymentStatus);
    if (query.serviceId) params.set("serviceId", query.serviceId);

    if (query.startDate) {
      params.set("startDate", (query.startDate as Date).toISOString());
    }
    if (query.endDate) {
      params.set("endDate", (query.endDate as Date).toISOString());
    }

    params.set("page", String(query.page ?? 1));
    params.set("limit", String(query.limit ?? 10));
    params.set("sortBy", query.sortBy ?? "createdAt");
    params.set("sortOrder", query.sortOrder ?? "desc");

    const res = await fetch(
      `${backendUrl}/api/technicians/bookings?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to load bookings.",
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

    const bookingsResult = result.data?.result;

    return {
      success: true,
      message: result.message || "Bookings fetched successfully.",
      data: bookingsResult?.data || [],
      meta: bookingsResult?.meta || {
        currentPage: 1,
        limit: 10,
        totalRow: 0,
        totalPage: 0,
      },
      errorDetails: [],
    };
  } catch (error) {
    console.error("Get technician bookings error:", error);

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

    //revalidating admin booking
    revalidateTag("all-bookings-admin", {
      expire: 0,
    });

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

    const booking = bookingResult.data.booking;

    // Verify this booking belongs to the logged-in customer
    if (booking.customerId !== user.id) {
      return {
        success: false,
        message: "You are not allowed to cancel this booking.",
        errorDetails: [],
      };
    }

    // Cancel the booking only if it is not in progress or completed
    if (booking.status === "IN_PROGRESS" || booking.status === "COMPLETED") {
      return {
        success: false,
        message: `This booking cannot be cancelled because it is already ${booking.status}.`,
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

    //revalidating admin booking
    revalidateTag("all-bookings-admin", {
      expire: 0,
    });

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

export type CreateBookingPayload = {
  serviceId: string;
  scheduledAt: string;
  location: string;
  customerNote?: string;
};

export type BookingActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errorDetails?: {
    field: string;
    message: string;
  }[];
};

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<BookingActionResponse> => {
  if (!payload.serviceId) {
    return {
      success: false,
      message: "Service ID is required.",
    };
  }

  if (!payload.scheduledAt) {
    return {
      success: false,
      message: "Booking date and time are required.",
    };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const verify = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!)
    : null;

  if (!accessToken || !verify?.success || verify.data?.role !== "CUSTOMER") {
    return {
      success: false,
      message:
        "You are not logged in,Please log in to create a booking or you are not a customer.",
      statusCode: 401,
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to create booking.",
        statusCode: res.status || result.statusCode,
        errorDetails: result.errorDetails || [],
      };
    }
    //revalidating admin booking
    revalidateTag("all-bookings-admin", {
      expire: 0,
    });

    return {
      success: true,
      message: result.message || "Booking created successfully.",
      data: result.data,
      statusCode: res.status,
    };
  } catch (error) {
    console.error("Create booking action error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      statusCode: 500,
    };
  }
};

export const getBookingById = async (
  bookingId: string,
): Promise<ActionResponse<GetBookingDetailsResponse>> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "Please log in to continue.",
      errorDetails: [],
    };
  }

  try {
    const res = await fetch(`${backendUrl}/api/booking/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to get booking details.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Booking retrieved successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Get booking by ID error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
