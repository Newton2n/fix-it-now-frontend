"use server";
import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;

export const getAllCategories = async () => {
  try {
    const res = await fetch(`${backendUrl}/api/categories`, {
      method: "GET",
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to fetch categories.",
        errorDetails: result.errorDetails || [],
      };
    }

    return {
      success: true,
      message: result.message || "Categories retrieved successfully.",
      data: result.data.result.data,
      meta: result.data.result.meta,
    };
  } catch (error) {
    console.error("Get categories error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const getCategoryDetails = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Category id required",
    };
  }
  const res = await fetch(`${backendUrl}/api/categories/${id}`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 72,
      tags: ["category-details"],
    },
  });
  const result = await res.json();
  if (result.success) {
    return result;
  }
};
