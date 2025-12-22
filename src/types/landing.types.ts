export interface MediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
}

export interface MediaFile {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats?: {
    large?: MediaFormat;
    medium?: MediaFormat;
    small?: MediaFormat;
    thumbnail?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Occasion {
  id: number;
  documentId: string;
  name: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  backgroundMedia?: MediaFile;
  category?: Category;
  occasion?: Occasion;
}

export interface LandingPageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  heroSlides: HeroSlide[];
}

export interface LandingPageResponse {
  data: LandingPageData;
  meta: Record<string, unknown>;
}
