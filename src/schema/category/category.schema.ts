export type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryApiResponse = {
  success: boolean;
  message: string;
  data: {
    result: {
      meta: {
        currentPage: number;
        limit: number;
        totalRow: number;
        totalPage: number;
      };
      data: Category[];
    };
  };
};