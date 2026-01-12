import { api } from './api-client';

// Subscriber data structure from Strapi
export interface SubscriberData {
  id: number;
  documentId: string;
  email: string;
  subscribedAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Strapi response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

class SubscriberService {
  /**
   * Subscribe a user to the newsletter
   */
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address',
        };
      }

      // Check if email already exists
      const checkResponse = await api.get<StrapiResponse<SubscriberData[]>>('/api/subscribers', {
        params: {
          'filters[email][$eq]': email,
        },
      });

      if (checkResponse.data.data && checkResponse.data.data.length > 0) {
        return {
          success: false,
          message: 'This email is already subscribed',
        };
      }

      // Create new subscriber
      const payload = {
        data: {
          email,
          subscribedAt: new Date().toISOString(),
        },
      };

      await api.post<StrapiResponse<SubscriberData>>('/api/subscribers', payload);

      return {
        success: true,
        message: 'Successfully subscribed to newsletter!',
      };
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      
      // Handle specific Strapi errors
      if (error.response?.data?.error?.message) {
        return {
          success: false,
          message: error.response.data.error.message,
        };
      }

      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
      };
    }
  }

  /**
   * Unsubscribe a user from the newsletter (optional feature)
   */
  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find subscriber by email
      const response = await api.get<StrapiResponse<SubscriberData[]>>('/api/subscribers', {
        params: {
          'filters[email][$eq]': email,
        },
      });

      if (!response.data.data || response.data.data.length === 0) {
        return {
          success: false,
          message: 'Email not found in our subscribers list',
        };
      }

      const subscriberId = response.data.data[0].id;

      // Delete the subscriber
      await api.delete(`/api/subscribers/${subscriberId}`);

      return {
        success: true,
        message: 'Successfully unsubscribed from newsletter',
      };
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again later.',
      };
    }
  }
}

export default new SubscriberService();
