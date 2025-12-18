import type { BlogPost, Comment } from '../types/blog.types';

const API_URL = 'http://localhost:3001';

class BlogService {
  /**
   * Fetch all blog posts
   */
  async getBlogPosts(page: number = 1, limit: number = 9): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_URL}/blogs?_page=${page}&_limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  /**
   * Fetch a single blog post by ID
   */
  async getBlogPostById(id: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${API_URL}/blogs/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  /**
   * Fetch comments for a blog post
   */
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const response = await fetch(`${API_URL}/comments?postId=${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  /**
   * Add a comment to a blog post
   */
  async addComment(postId: string, author: string, content: string): Promise<Comment> {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newComment: Comment = {
          id: Date.now().toString(),
          postId,
          author,
          content,
          createdAt: new Date(),
          likes: 0,
        };
        resolve(newComment);
      }, 300);
    });
  }
}

export default new BlogService();
