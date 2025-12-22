import { api } from './api-client';
import type { LandingPageResponse, HeroSlide } from '../types/landing.types';
import { buildProductFilterUrl } from '../utils/urlBuilder';

class LandingService {
  /**
   * Fetch landing page data including hero slides
   */
  async getLandingPageData(): Promise<HeroSlide[]> {
    try {
      const response = await api.get<LandingPageResponse>(
        '/api/landing-page',
        {
          params: {
            'populate[heroSlides][populate]': '*',
          },
        }
      );

      const slides = response.data.data.heroSlides || [];
      
      // Filter active slides and sort by order
      return slides
        .filter((slide) => slide.isActive)
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error fetching landing page data:', error);
      throw error;
    }
  }

  /**
   * Build the product filter URL from a hero slide's category and occasion
   */
  buildFilterUrl(slide: HeroSlide): string {
    return buildProductFilterUrl({
      category: slide.category?.slug || slide.category?.name || null,
      occasions: slide.occasion ? [slide.occasion.slug || slide.occasion.name] : [],
    });
  }

  /**
   * Get the background image URL from a slide, with fallback to smaller formats
   */
  getBackgroundImageUrl(slide: HeroSlide): string | null {
    if (!slide.backgroundMedia) {
      return null;
    }

    const media = slide.backgroundMedia;
    
    // Try to get the best available image format
    // All URLs from Cloudinary are absolute, so no need to prepend base URL
    const imageUrl = 
      media.formats?.large?.url ||
      media.formats?.medium?.url ||
      media.url;

    return imageUrl || null;
  }
}

export default new LandingService();
