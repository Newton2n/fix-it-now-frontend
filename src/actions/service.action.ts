"use server";
import { TCreateService, TUpdateService } from "@/types/service";
import { jwtUtils } from "@/utils/jwt";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API;
import { ServiceSearchFilters, ServiceSearchFiltersSchema } from "@/schema/service/service.schema";

type GetAllServiceParams = {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: string;
  sortBy?: "price" | "date";
  sortOrder?: "asc" | "desc";
};

export const getAllService = async (params: GetAllServiceParams = {}) => {
  try {
    const parsedParams = ServiceSearchFiltersSchema.parse(params);

    const searchParams = new URLSearchParams();

    if (parsedParams.search) {
      searchParams.set("search", parsedParams.search);
    }

    searchParams.set("page", String(parsedParams.page));

    searchParams.set("limit", String(parsedParams.limit));

    searchParams.set("sortBy", parsedParams.sortBy);

    searchParams.set("sortOrder", parsedParams.sortOrder);

    if (parsedParams.categoryId) {
      searchParams.set("categoryId", parsedParams.categoryId);
    }

    if (parsedParams.minPrice !== undefined) {
      searchParams.set("minPrice", String(parsedParams.minPrice));
    }

    if (parsedParams.maxPrice !== undefined) {
      searchParams.set("maxPrice", String(parsedParams.maxPrice));
    }

    if (parsedParams.isAvailable) {
      searchParams.set("isAvailable", parsedParams.isAvailable);
    }

    const res = await fetch(
      `${backendUrl}/api/service?${searchParams.toString()}`,
      {
        method: "GET",
        cache: "force-cache",
        next: {
          tags: ["all-service"],
          revalidate: 60 * 60 * 72,
        },
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to fetch services.",
        errorDetails: result.errorDetails || [],
      };
    }

    return result;
  } catch (error) {
    console.error("Get services error:", error);

    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

export const getAllServiceByCategoryId = async (id: string) => {
  const res = await fetch(`${backendUrl}/api/service/category/${id}`, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["services-by-category"],
    },
  });
  const result = await res.json();
  if (result.success) {
    return result;
  }
};
// get all service by login technician
export const getAllServiceByLoginTechnician = async (
  query: Partial<ServiceSearchFilters> = {},
) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const emptyMeta = {
    currentPage: 1,
    limit: 10,
    totalRow: 0,
    totalPage: 0,
  };

  const verify = jwtUtils.verifyToken(
    accessToken as string,
    process.env.JWT_ACCESS_SECRET!,
  );

  if (!verify.success || verify.data?.role !== "TECHNICIAN") {
    return {
      success: false,
      message: "Sorry, you have no permission",
      data: [],
      meta: emptyMeta,
      errorDetails: [],
    };
  }

  try {
    const params = new URLSearchParams();

    if (query.search) params.set("search", query.search);
    if (query.categoryId) params.set("categoryId", query.categoryId);
    if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
    if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
    if (query.isAvailable !== undefined) params.set("isAvailable", query.isAvailable);
    params.set("page", String(query.page ?? 1));
    params.set("limit", String(query.limit ?? 10));
    params.set("sortBy", query.sortBy ?? "date");
    params.set("sortOrder", query.sortOrder ?? "desc");

    const res = await fetch(
      `${backendUrl}/api/technicians/services?${params.toString()}`,
      {
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
        message: result.message || "Unable to load services.",
        data: [],
        meta: emptyMeta,
        errorDetails: result.errorDetails || [],
      };
    }

    const servicesResult = result.data?.result;
    console.log("service by login technician",query,servicesResult)

    return {
      success: true,
      message: result.message || "Services fetched successfully.",
      data: servicesResult?.data || [],
      meta: servicesResult?.meta || emptyMeta,
      errorDetails: [],
    };
  } catch (error) {
    console.error("Get technician services error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      data: [],
      meta: emptyMeta,
      errorDetails: [],
    };
  }
};

// get single service details
export const getSingleService = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Service id required",
    };
  }

  const res = await fetch(`${backendUrl}/api/service/${id}`, {
    method :"GET",
    cache: "no-store",
  });
  const result = await res.json();

  if (result.success) {
    return result;
  }
};

//create service
export const createService = async (data: TCreateService) => {
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
    const res = await fetch(`${backendUrl}/api/service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to create service.",
        errorDetails: result.errorDetails || [],
      };
    }

    //revalidate all service by category section
    revalidateTag("services-by-category", {
      expire: 0,
    });
    // revalidate all service in home page
    revalidateTag("all-service", {
      expire: 0,
    });
    return {
      success: true,
      message: result.message || "Service created successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Create service error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

//update service
export const updateService = async (id: string, data: TUpdateService) => {
  if (!id) {
    return {
      success: false,
      message: "Service id required",
    };
  }

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
    const res = await fetch(`${backendUrl}/api/service/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to update service.",
        errorDetails: result.errorDetails || [],
      };
    }

    //revalidate all service by category section
    revalidateTag("services-by-category", {
      expire: 0,
    });
    // revalidate all service in home page
    revalidateTag("all-service", {
      expire: 0,
    });

    return {
      success: true,
      message: result.message || "Service updated successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Update service error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};

//delete service
export const deleteService = async (id: string) => {
  if (!id) {
    return {
      success: false,
      message: "Service id required",
    };
  }

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
    const res = await fetch(`${backendUrl}/api/service/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Unable to delete service.",
        errorDetails: result.errorDetails || [],
      };
    }

    //revalidate all service by category section
    revalidateTag("services-by-category", {
      expire: 0,
    });
    // revalidate all service in home page
    revalidateTag("all-service", {
      expire: 0,
    });

    return {
      success: true,
      message: result.message || "Service deleted successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Delete service error:", error);
    return {
      success: false,
      message: "Unable to connect to the server. Please try again.",
      errorDetails: [],
    };
  }
};
