// Strapi image format
export interface StrapiImage {
  id: number;
  documentId?: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
  url: string;
}

// Strapi response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Blog post data structure from Strapi v5 (flat structure)
export interface BlogPostData {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  category?: string;
  tags?: string | string[];
  coverImage?: StrapiImage | null;
  articlePublishedAt?: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Transformed blog post for frontend use
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  category?: string;
  tags: string[];
  imageUrl: string | null;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Comment data structure from Strapi v5 (flat structure)
export interface CommentData {
  id: number;
  documentId: string;
  context: string; // Note: field is 'context' not 'content' in Strapi
  author: string;
  email: string;
  userNmae?: string; // Optional user name field (note: typo in Strapi)
  commentedDate?: string | null;
  blogpost?: number | { id: number } | null; // Can be ID or populated object
  parentComment?: number | null; // For nested replies
  approved?: boolean; // Approval flag
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Transformed comment for frontend use
export interface Comment {
  id: number;
  content: string;
  author: string;
  email: string;
  blogPostId: number;
  parentCommentId?: number; // For nested replies
  approved?: boolean; // Only approved comments should be displayed (optional field)
  createdAt: Date;
  publishedAt: Date;
  replies?: Comment[]; // Nested replies
}

// Request payload for creating a comment
export interface CreateCommentPayload {
  content: string;
  author: string;
  email: string;
  blogPost: number;
  parentComment?: number; // Optional - for replies
  approved?: boolean; // Default should be false for moderation
}
