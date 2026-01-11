import { api } from './api-client';
import type {
  BlogPost,
  BlogPostData,
  Comment,
  CommentData,
  CreateCommentPayload,
  StrapiResponse,
} from '../types/blog.types';

class BlogService {
  private readonly STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'https://pk-engrave-service.onrender.com';

  /**
   * Transform Strapi blog post data to frontend format
   */
  private transformBlogPost(data: BlogPostData): BlogPost {
    if (!data) {
      console.error('Invalid blog post data:', data);
      throw new Error('Invalid blog post data');
    }

    // Handle coverImage - it's directly on the data object in Strapi v5
    const imageUrl = data.coverImage?.url || null;

    // Handle tags - could be string or array
    let tags: string[] = [];
    if (typeof data.tags === 'string') {
      tags = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(data.tags)) {
      tags = data.tags;
    }

    return {
      id: data.id,
      title: data.title || '',
      slug: data.slug || '',
      description: data.description || '',
      content: data.content || '',
      author: data.author || 'Unknown',
      category: data.category,
      tags,
      imageUrl,
      publishedAt: new Date(data.publishedAt || data.createdAt),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  /**
   * Transform Strapi comment data to frontend format
   */
  private transformComment(data: CommentData): Comment {
    return {
      id: data.id,
      content: data.content,
      author: data.author,
      email: data.email,
      blogPostId: typeof data.blogPost === 'number' ? data.blogPost : 0,
      createdAt: new Date(data.createdAt),
      publishedAt: new Date(data.publishedAt),
    };
  }

  /**
   * Fetch all blog posts with pagination and search
   */
  async getBlogPosts(
    page: number = 1,
    pageSize: number = 9,
    search?: string
  ): Promise<{ posts: BlogPost[]; pagination: any }> {
    try {
      const params: any = {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        populate: 'coverImage',
        sort: 'publishedAt:desc',
      };

      // Add search filter if provided
      if (search && search.trim()) {
        params['filters[$or][0][title][$containsi]'] = search;
        params['filters[$or][1][description][$containsi]'] = search;
        params['filters[$or][2][content][$containsi]'] = search;
      }

      const response = await api.get<StrapiResponse<BlogPostData[]>>('/api/blog-posts', { params });

      // Check if data exists and is an array
      if (!response.data.data || !Array.isArray(response.data.data)) {
        console.error('Invalid response structure:', response.data);
        return { posts: [], pagination: null };
      }

      const posts = response.data.data.map((post) => {
        return this.transformBlogPost(post);
      });

      return {
        posts,
        pagination: response.data.meta?.pagination || null,
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return { posts: [], pagination: null };
    }
  }

  /**
   * Fetch a single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await api.get<StrapiResponse<BlogPostData[]>>('/api/blog-posts', {
        params: {
          'filters[slug][$eq]': slug,
          populate: 'coverImage',
        },
      });

      if (response.data.data.length === 0) {
        return null;
      }

      return this.transformBlogPost(response.data.data[0]);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  /**
   * Fetch a single blog post by ID
   */
  async getBlogPostById(id: number): Promise<BlogPost | null> {
    try {
      const response = await api.get<StrapiResponse<BlogPostData>>(`/api/blog-posts/${id}`, {
        params: {
          populate: 'coverImage',
        },
      });

      return this.transformBlogPost(response.data.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  /**
   * Fetch comments for a blog post
   */
  async getComments(blogPostId: number, page: number = 1, pageSize: number = 20): Promise<Comment[]> {
    try {
      const response = await api.get<StrapiResponse<CommentData[]>>('/api/comments', {
        params: {
          'filters[blogPost][id][$eq]': blogPostId,
          sort: 'createdAt:desc',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });

      return response.data.data.map((comment) => this.transformComment(comment));
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  /**
   * Add a comment to a blog post
   */
  async addComment(blogPostId: number, author: string, email: string, content: string): Promise<Comment | null> {
    try {
      const payload: { data: CreateCommentPayload } = {
        data: {
          content,
          author,
          email,
          blogPost: blogPostId,
        },
      };

      const response = await api.post<StrapiResponse<CommentData>>('/api/comments', payload);

      return this.transformComment(response.data.data);
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  }
}

export default new BlogService();
