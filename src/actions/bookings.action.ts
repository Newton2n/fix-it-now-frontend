"use server";

import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

export const getAllBookingsFromLoginUser = async () => {
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

  const res = await fetch(`${backendUrl}/api/booking`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "force-cache",
    next: {
      tags: ["user-bookings"],
      revalidate: 60 * 60 * 24,
    },
  });
  const result = await res.json();
  console.log("Bookings response", result);
  if (result.success) {
    return result.data.bookings;
  }
};
export const getAllBookingsFromLoginTechnician = async () => {
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

  const res = await fetch(`${backendUrl}/api/technicians/bookings`, {
    headers: {
      Cookie: `accessToken=${accessToken}`,
    },
    cache: "force-cache",
    next: {
      tags: ["user-bookings"],
      revalidate: 60 * 60 * 12,
    },
  });
  const result = await res.json();
  console.log("Technician Bookings response", result);
  if (result.success) {
    return result.data;
  }
};

export const acceptBooking = async (bookingId: string) => {
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
    const res = await fetch(
      `${backendUrl}/api/bookings/${bookingId}/accept`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to accept booking.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Booking accepted successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Accept booking error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const declineBooking = async (bookingId: string, reason?: string) => {
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
    const res = await fetch(
      `${backendUrl}/api/bookings/${bookingId}/decline`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
        body: JSON.stringify({ reason }),
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to decline booking.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Booking declined successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Decline booking error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const startBooking = async (bookingId: string) => {
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
    const res = await fetch(
      `${backendUrl}/api/bookings/${bookingId}/start`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to start booking.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Booking started successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Start booking error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const completeBooking = async (bookingId: string) => {
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
    const res = await fetch(
      `${backendUrl}/api/bookings/${bookingId}/complete`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to complete booking.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Booking completed successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Complete booking error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const cancelBooking = async (bookingId: string) => {
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
    const res = await fetch(
      `${backendUrl}/api/bookings/${bookingId}/cancel`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${accessToken}`,
        },
      }
    );

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to cancel booking.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: "Booking cancelled successfully.",
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
