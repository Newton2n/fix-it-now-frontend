"use server";

import type {
  TLoginFormData,
  TRegistrationFormData,
} from "@/schema/auth/auth.schema";
import { UserStatus } from "@/types/api";
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
    console.log("get Me",result)
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
  revalidatePath("/", "layout");

  return { success: true };
};

// google login
interface GoogleAuthInput {
  idToken: string;
}

export async function googleLogin({ idToken }: GoogleAuthInput) {
  console.log(
    "google id token received in server action:",
    typeof idToken,
    idToken,
  );

  try {
    if (!idToken || typeof idToken !== "string") {
      return {
        success: false,
        message: "Invalid or missing Google ID Token.",
      };
    }

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
