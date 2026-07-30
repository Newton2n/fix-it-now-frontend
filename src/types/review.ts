export type Review = {
  id: string;
  bookingId: string;
  description: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewResponse = {
  meta: {
    currentPage: number;
    limit: number;
    totalRow: number;
    totalPage: number;
  };
  data: Review[];
};

