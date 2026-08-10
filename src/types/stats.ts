export type AppStats = {
  categoriesCount: number;
  servicesCount: number;
  verifiedTechnicianCount: number;
  bookingCount: number;
  paymentsCount: number;
  userCount: number;
  reviewsCount: number;
  averageRating: number;
};

export type BookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DECLINED"
  | "CANCELED"
  | "PAID"
  | "IN_PROGRESS"
  | "COMPLETED";

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export type DashboardUser = {
  name: string;
  email: string;
};

export type DashboardTechnician = {
  user: {
    name: string;
  };
};

export type DashboardService = {
  title: string;
  price?: number;
  technician?: DashboardTechnician;
};

export type DashboardPayment = {
  amount: number;
  status: PaymentStatus;
};

export type RecentBookingBase = {
  id: string;
  status: BookingStatus;
  scheduledAt: string | null;
  location: string;
};

export type DashboardApiResponse<T> = {
  success: boolean;
  message: string;
  data?: {
    result?: T;
  };
};

export type DashboardActionResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export type AdminRecentBooking = RecentBookingBase & {
  createdAt: string;
  user: DashboardUser;
  service: DashboardService & {
    price: number;
  };
  payment: DashboardPayment | null;
};

export type AdminDashboardData = {
  overview: {
    categoriesCount: number;
    servicesCount: number;
    verifiedTechnicianCount: number;
    bookingCount: number;
    activeUserCount: number;
    customerCount: number;
    technicianCount: number;
    reviewsCount: number;
    successfulPaymentsCount: number;
    revenue: number;
    averageRating: number;
  };

  bookingStatus: {
    requested: number;
    accepted: number;
    declined: number;
    canceled: number;
    paid: number;
    inProgress: number;
    completed: number;
  };

  recentBookings: AdminRecentBooking[];
};

export type TechnicianRecentBooking = RecentBookingBase & {
  user: DashboardUser;
  service: DashboardService;
  payment: DashboardPayment | null;
};

export type TechnicianDashboardData = {
  overview: {
    servicesCount: number;
    activeServicesCount: number;
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    canceledBookings: number;
    reviewsCount: number;
    averageRating: number;
    earnings: number;
  };

  recentBookings: TechnicianRecentBooking[];
};

export type CustomerRecentBooking = RecentBookingBase & {
  service: DashboardService;
  payment: DashboardPayment | null;
};

export type CustomerDashboardData = {
  overview: {
    totalBookings: number;
    requestedBookings: number;
    acceptedBookings: number;
    completedBookings: number;
    canceledBookings: number;
    totalReviews: number;
    paymentsCount: number;
    totalSpent: number;
  };

  recentBookings: CustomerRecentBooking[];
};



