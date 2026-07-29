export interface ServiceItem {
  id: string;
  categoryId: string;
  technicianId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  thumbnailImage: string | null;
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceMeta {
  currentPage: number;
  limit: number;
  totalRow: number;
  totalPage: number;
}

export interface ServiceResult {
  meta: ServiceMeta;
  data: ServiceItem[];
}

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: {
    result: ServiceResult;
  };
}