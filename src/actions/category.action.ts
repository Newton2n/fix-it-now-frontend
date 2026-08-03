"use server";

const backendUrl = process.env.BACKEND_API;

import { CategorySearchSchema } from "@/schema/category/category.schema";

type GetAllCategoriesParams = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export const getAllCategories = async (params: GetAllCategoriesParams = {}) => {
  try {
    const parsedParams = CategorySearchSchema.parse(params);

    const searchParams = new URLSearchParams();

    if (parsedParams.search) {
      searchParams.set("search", parsedParams.search);
    }

    searchParams.set("page", String(parsedParams.page));
    searchParams.set("limit", String(parsedParams.limit));
    searchParams.set("sortBy", parsedParams.sortBy);
    searchParams.set("sortOrder", parsedParams.sortOrder);

    const res = await fetch(
      `${backendUrl}/api/categories?${searchParams.toString()}`,
      {
        method: "GET",
        cache: "force-cache",
        next: {
          revalidate: 60 * 60 * 72,
          tags: ["all-category-home"],
        },
      },
    );

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
