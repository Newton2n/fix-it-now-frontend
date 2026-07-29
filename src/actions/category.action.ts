"use server"
import { jwtUtils } from "@/utils/jwt";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;
export const getAllCategories = async () => {
  const res = await fetch(`${backendUrl}/api/categories`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 72,
      tags: ["all-category"],
    },
  });
  const result = await res.json();
  if (result.success) {
    return result;
  }
};

export const getCategoryDetails =async (id:string) => {
    if(!id){
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

