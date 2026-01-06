import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTaxonomies, type TaxonomyItem } from '../../services/taxonomy.service';
import { ROUTES } from '../../constants';
import './DesktopNavDropdown.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'occasion' | 'recipient' | 'product' | 'teams';
}

const BULK_ORDER_CATEGORIES = [
  { id: 'drinkware', name: 'Drinkware', slug: 'drinkware' },
  { id: 'coasters', name: 'Coasters', slug: 'coasters' },
  { id: 'plaques', name: 'Plaques', slug: 'plaques' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories' },
];

const DesktopNavDropdown: React.FC<Props> = ({ isOpen, onClose, type }) => {
  const navigate = useNavigate();
  const [occasions, setOccasions] = useState<TaxonomyItem[]>([]);
  const [recipientLists, setRecipientLists] = useState<TaxonomyItem[]>([]);
  const [productCategories, setProductCategories] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { occasions: occs, recipientLists: recs, productCategories: cats } = await getAllTaxonomies();
        if (!mounted) return;
        setOccasions(occs);
        setRecipientLists(recs);
        setProductCategories(cats);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load taxonomies', error);
        if (mounted) setLoading(false);
      }
    }
    if (isOpen) {
      load();
    }
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const handleNavigation = (navType: 'occasions' | 'recipientLists' | 'productCategories', slug: string) => {
    const params = new URLSearchParams();
    params.set(navType, slug);
    navigate(`${ROUTES.PRODUCTS}?${params.toString()}`);
    onClose();
  };

  const handleBulkNavigation = (categorySlug: string) => {
    const params = new URLSearchParams();
    params.set('bulkEligible', 'true');
    params.set('productCategories', categorySlug);
    navigate(`${ROUTES.PRODUCTS}?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  const getItems = () => {
    switch (type) {
      case 'occasion':
        return occasions;
      case 'recipient':
        return recipientLists;
      case 'product':
        return productCategories;
      case 'teams':
        return BULK_ORDER_CATEGORIES;
      default:
        return [];
    }
  };

  const items = getItems();

  return (
    <div className="desktop-nav-dropdown">
      {loading ? (
        <div className="desktop-nav-dropdown-loading">Loading...</div>
      ) : (
        <div className="desktop-nav-dropdown-list">
          {items.map((item) => (
            <button
              key={item.id}
              className="desktop-nav-dropdown-item"
              onClick={() => {
                if (type === 'teams') {
                  handleBulkNavigation(item.slug || item.name);
                } else {
                  const navType =
                    type === 'occasion'
                      ? 'occasions'
                      : type === 'recipient'
                      ? 'recipientLists'
                      : 'productCategories';
                  handleNavigation(navType, item.slug || item.name);
                }
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DesktopNavDropdown;
