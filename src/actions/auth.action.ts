"use server";

import type {
  TLoginFormData,
  TRegistrationFormData,
} from "@/schema/auth/auth.schema";
import { id } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const backendUrl = process.env.BACKEND_API;

export const login = async (data: TLoginFormData) => {
  try {
    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Invalid credentials.",
        errorDetails: result.errorDetails || [],
      };
    }

    if (result.success) {
      const cookie = await cookies();
      cookie.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });
      cookie.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
    }

    console.log("login result", result);

    return result;
  } catch (error) {
    console.error("Login action error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const register = async (data: TRegistrationFormData) => {
  try {
    const { confirmPassword, ...registerData } = data;

    const res = await fetch(`${backendUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(registerData),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Registration failed.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Account created successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Register action error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const getMe = async () => {
  await connection();
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const res = await fetch(`${backendUrl}/api/auth/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Invalid credentials.",
        errorDetails: result.errorDetails || [],
      };
    }
    return result;
  } catch (error) {
    console.error("Login action error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // Clear client-side router cache for the entire layout tree
  revalidatePath("/", "layout");
  redirect("/login");
};

// google login
interface GoogleAuthInput {
  idToken: string;
}


export async function googleLogin({ idToken }: GoogleAuthInput) {
  console.log("google id token received in server action:", typeof idToken, idToken);

  try {
    // 1. Sanity Check: Prevent non-string payloads from reaching the backend
    if (!idToken || typeof idToken !== "string") {
      return {
        success: false,
        message: "Invalid or missing Google ID Token.",
      };
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    // 2. Forward strictly as JSON { idToken: "eyJ..." }
    const response = await fetch(`${backendUrl}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Google authentication failed",
      };
    }

    // 3. Set HTTP-Only Cookies in Next.js
    if (result.data?.accessToken) {
      const cookieStore = await cookies();

      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
        path: "/",
      });

      if (result.data?.refreshToken) {
        cookieStore.set("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: "lax",
          path: "/",
        });
      }
    }

    return {
      success: true,
      message: result.message || "Login successful",
      user: result.data?.user,
    };
  } catch (error) {
    console.error("Google login error:", error);
    return {
      success: false,
      message: "Server error occurred during Google authentication",
    };
  }
}