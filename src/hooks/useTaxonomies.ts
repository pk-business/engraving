import { useState, useEffect } from 'react';
import { getAllTaxonomies, type TaxonomyItem } from '../services/taxonomy.service';

interface UseTaxonomiesResult {
  occasions: TaxonomyItem[];
  recipientLists: TaxonomyItem[];
  productCategories: TaxonomyItem[];
  materials: TaxonomyItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to load and manage taxonomy data
 * @param options - Configuration options
 * @param options.loadOnMount - Whether to load taxonomies when component mounts (default: true)
 * @param options.loadOnOpen - Trigger to load taxonomies (useful for dropdowns/modals)
 * @returns Taxonomy data, loading state, error state, and refetch function
 */
export function useTaxonomies(options: {
  loadOnMount?: boolean;
  loadOnOpen?: boolean;
} = {}): UseTaxonomiesResult {
  const { loadOnMount = true, loadOnOpen } = options;
  
  const [occasions, setOccasions] = useState<TaxonomyItem[]>([]);
  const [recipientLists, setRecipientLists] = useState<TaxonomyItem[]>([]);
  const [productCategories, setProductCategories] = useState<TaxonomyItem[]>([]);
  const [materials, setMaterials] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTaxonomies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllTaxonomies();
      setOccasions(data.occasions);
      setRecipientLists(data.recipientLists);
      setProductCategories(data.productCategories);
      setMaterials(data.materials);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to load taxonomies');
      setError(errorMessage);
      console.error('Failed to load taxonomies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const shouldLoad = loadOnMount || (loadOnOpen !== undefined && loadOnOpen);
    
    if (shouldLoad) {
      loadTaxonomies().then(() => {
        if (!mounted) {
          // Reset state if component unmounted during load
          setOccasions([]);
          setRecipientLists([]);
          setProductCategories([]);
          setMaterials([]);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [loadOnMount, loadOnOpen]);

  return {
    occasions,
    recipientLists,
    productCategories,
    materials,
    loading,
    error,
    refetch: loadTaxonomies,
  };
}
