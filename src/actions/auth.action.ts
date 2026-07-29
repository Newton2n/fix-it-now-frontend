"use server";

import type {
  TLoginFormData,
  TRegistrationFormData,
} from "@/schema/auth/auth.schema";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

export const login = async (data: TLoginFormData) => {
  console.log(data, "log in form data ");
  try {
    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(data),
    });

    const result = await res.json();

    // if (!result.success) {
    //   return {
    //     success: false,
    //     message: result.message || "Invalid credentials.",
    //     errorDetails: result.errorDetails || [],
    //   };
    // }

    console.log("this block is running");
    if (result.success) {
      const cookie = await cookies();
      cookie.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
      });
      cookie.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    // const decodeAccessToken = Jwt.decode(result.data.accessToken) as JwtPayload;

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
    // confirmPassword is only for frontend validation.
    // Do not send it to the backend.
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


