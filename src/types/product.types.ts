export const MaterialType = {
  METAL: 'metal',
  LEATHER: 'leather',
  WOOD: 'wood',
  ACRYLIC: 'acrylic',
  GLASS: 'glass',
} as const;

export type MaterialType = (typeof MaterialType)[keyof typeof MaterialType] | string;

export const OccasionType = {
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  CHRISTMAS: 'christmas',
  GRADUATION: 'graduation',
  CORPORATE: 'corporate',
  HOLIDAYS: 'holidays',
  HOBBIES: 'hobbies',
  HOME: 'home',
} as const;

export type OccasionType = (typeof OccasionType)[keyof typeof OccasionType] | string;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: {
    main: string;
    alt: string;
  };
  images: string[];
  material: MaterialType | string;
  occasions: OccasionType[] | string[];
  /** Optional categories/tags for higher-level browsing (e.g. 'personal-milestones', 'home-living') */
  categories?: string[];
  category: string;
  customizable: boolean;
  sizes?: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductFilter {
  materials?: string[];
  occasions?: string[];
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface CustomizationOption {
  type: 'text' | 'image';
  maxLength?: number;
  allowedFormats?: string[];
  placeholder?: string;
}

export interface ProductCustomization {
  productId: string;
  customText?: string;
  customImage?: File | string;
  selectedSize?: string;
}
