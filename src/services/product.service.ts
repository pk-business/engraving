import type { Product, ProductFilter } from '../types/product.types';

const API_URL = 'http://localhost:3001';

class ProductService {
  /**
   * Fetch all products with optional filters
   */
  async getProducts(filters?: ProductFilter): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      let products: Product[] = await response.json();
      
      // Apply filters
      if (filters) {
        if (filters.materials && filters.materials.length > 0) {
          products = products.filter(p => filters.materials!.includes(p.material));
        }
        
        if (filters.occasions && filters.occasions.length > 0) {
          products = products.filter(p => 
            p.occasions.some(occ => filters.occasions!.includes(occ))
          );
        }

        if (filters.categories && filters.categories.length > 0) {
          products = products.filter(p => {
            // Prefer explicit categories array on the product; fall back to the legacy `category` string
            if (p.categories && Array.isArray(p.categories)) {
              return p.categories.some(c => filters.categories!.includes(c));
            }
            if (p.category && typeof p.category === 'string') {
              // normalize legacy category string into a simple key for comparison
              const key = p.category.toLowerCase().replace(/\s+/g, '-');
              return filters.categories!.includes(key);
            }
            return false;
          });
        }
        
        if (filters.minPrice !== undefined) {
          products = products.filter(p => p.price >= filters.minPrice!);
        }
        
        if (filters.maxPrice !== undefined) {
          products = products.filter(p => p.price <= filters.maxPrice!);
        }
        
        if (filters.priceRange) {
          products = products.filter(p => 
            p.price >= filters.priceRange!.min && 
            p.price <= filters.priceRange!.max
          );
        }
        
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          products = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
          );
        }
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  /**
   * Fetch featured products for homepage
   */
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products?_limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }
}

export default new ProductService();
