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

export type ErrorDetail = {
  field: string;
  message: string;
};

export type ReviewResult = {
  id: string;
  bookingId: string;
  description: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export type OneReviewResponse =
  | {
      success: true;
      message: string;
      data: {
        result: ReviewResult;
      };
    }
  | {
      success: false;
      statusCode: number;
      message: string;
      errorDetails: ErrorDetail[];
    };
