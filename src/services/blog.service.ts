import { api } from './api-client';
import type { BlogPost, BlogPostData, Comment, CommentData, StrapiResponse } from '../types/blog.types';

class BlogService {
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
    // Handle blog_post - can be a number (ID) or an object with id
    let blogPostId = 0;
    const blogPostField = (data as any).blog_post || (data as any).blogpost;

    if (typeof blogPostField === 'number') {
      blogPostId = blogPostField;
    } else if (blogPostField && typeof blogPostField === 'object' && 'id' in blogPostField) {
      blogPostId = blogPostField.id;
    }

    return {
      id: data.id,
      content: data.context, // Map 'context' field from Strapi to 'content' for frontend
      author: data.author,
      email: data.email,
      blogPostId: blogPostId,
      parentCommentId: typeof data.parentComment === 'number' ? data.parentComment : undefined,
      approved: data.approved !== undefined ? data.approved : true, // Default to true if field doesn't exist
      createdAt: new Date(data.createdAt),
      publishedAt: new Date(data.publishedAt),
      replies: [],
    };
  }

  /**
   * Organize comments into a tree structure with replies
   */
  private organizeCommentsWithReplies(comments: Comment[]): Comment[] {
    // Filter only approved comments
    const approvedComments = comments.filter((comment) => comment.approved === true);

    // Separate top-level comments and replies
    const topLevelComments = approvedComments.filter((c) => !c.parentCommentId);
    const replies = approvedComments.filter((c) => c.parentCommentId);

    // Build the tree structure
    const commentMap = new Map<number, Comment>();

    // Initialize all comments in the map
    topLevelComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Add replies to their parent comments
    replies.forEach((reply) => {
      const parentId = reply.parentCommentId!;
      const parent = commentMap.get(parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(reply);
      }
    });

    // Return top-level comments with their replies nested
    return Array.from(commentMap.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
   * Fetch comments for a blog post (with nested replies)
   */
  async getComments(blogPostId: number, page: number = 1, pageSize: number = 100): Promise<Comment[]> {
    try {
      console.log('Fetching comments for blog post ID:', blogPostId);

      // Fetch all approved comments with the blog_post relation populated
      const response = await api.get<StrapiResponse<CommentData[]>>('/api/comments', {
        params: {
          'filters[approved][$eq]': true, // Only fetch approved comments
          populate: 'blog_post', // The relation field name in Strapi
          sort: 'createdAt:desc',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
        },
      });

      console.log('Comments fetched:', response.data.data);

      const comments = response.data.data.map((comment) => this.transformComment(comment));

      // Filter comments by blogPostId on the frontend
      const filteredComments = comments.filter((comment) => comment.blogPostId === blogPostId);

      console.log('Filtered comments for blog post:', filteredComments);

      // Organize comments into tree structure with replies
      const organizedComments = this.organizeCommentsWithReplies(filteredComments);

      console.log('Organized comments:', organizedComments);

      return organizedComments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  /**
   * Add a comment to a blog post
   * @param blogPostId - ID of the blog post
   * @param author - Name of the commenter
   * @param email - Email of the commenter
   * @param content - Comment content
   * @param parentCommentId - Optional ID of parent comment (for replies)
   * @param isLoggedIn - Whether the user is logged in (auto-approve if true)
   */
  async addComment(
    blogPostId: number,
    author: string,
    email: string,
    content: string,
    parentCommentId?: number,
    isLoggedIn: boolean = false
  ): Promise<Comment | null> {
    try {
      // Build payload matching your Strapi schema
      const payload: any = {
        data: {
          context: content, // Map 'content' parameter to 'context' field in Strapi
          author: author,
          email: email,
          approved: isLoggedIn ? true : false, // Auto-approve for logged in users
          blog_post: blogPostId, // Link to blog post
        },
      };

      // Add parent comment if this is a reply
      if (parentCommentId) {
        payload.data.parentComment = parentCommentId;
      }

      console.log('Sending comment payload:', JSON.stringify(payload, null, 2));

      const response = await api.post<StrapiResponse<CommentData>>('/api/comments', payload);

      console.log('Comment created successfully:', response.data);

      // Send email notification to admin
      this.sendCommentNotification(blogPostId, author, email, content, parentCommentId);

      return this.transformComment(response.data.data);
    } catch (error: any) {
      console.error('Error adding comment:', error);

      // Log detailed error for debugging
      if (error.response?.data) {
        console.error('Full Strapi error response:', JSON.stringify(error.response.data, null, 2));
      }

      return null;
    }
  }

  /**
   * Send email notification when a new comment is posted
   * This will be handled by the backend email service
   */
  private async sendCommentNotification(
    blogPostId: number,
    author: string,
    email: string,
    content: string,
    parentCommentId?: number
  ): Promise<void> {
    try {
      // Call the backend email notification endpoint (not Strapi)
      // This assumes your backend server is running on localhost:5000
      const backendUrl = 'http://localhost:5000'; // Change this to your backend server URL

      await fetch(`${backendUrl}/api/email/comment-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogPostId,
          author,
          email,
          content,
          parentCommentId,
          adminEmail: 'premkarki.business@gmail.com',
        }),
      });
    } catch (error) {
      console.error('Error sending comment notification:', error);
      // Don't throw error - email notification failure shouldn't break comment posting
    }
  }
}

export default new BlogService();
