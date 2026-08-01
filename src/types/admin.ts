export type PaginatedResult<T> = {
  meta: {
    page: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: T[];
};


export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export type User = {
  id: string;
  name: string;
  phoneNumber: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  country: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserMeta = {
  currentPage: number;
  limit: number;
  totalRow: number;
  totalPage: number;
};
