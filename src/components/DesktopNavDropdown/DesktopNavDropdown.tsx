import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BULK_ORDER_CATEGORIES } from '../../constants';
import { useTaxonomies } from '../../hooks/useTaxonomies';
import { navigateToProducts, navigateToBulkProducts, getNavigationParamKey } from '../../utils/navigationHelpers';
import './DesktopNavDropdown.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'occasion' | 'recipient' | 'product' | 'teams';
  arrowOffset?: number;
}

const DesktopNavDropdown: React.FC<Props> = ({ isOpen, onClose, type, arrowOffset = 0 }) => {
  const navigate = useNavigate();
  const { occasions, recipientLists, productCategories, loading } = useTaxonomies({ loadOnOpen: isOpen });

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

  const handleClick = (item: (typeof items)[0]) => {
    if (type === 'teams') {
      navigateToBulkProducts(navigate, item.slug || item.name, onClose);
    } else {
      const navType = getNavigationParamKey(type);
      navigateToProducts(navigate, navType, item.slug || item.name, onClose);
    }
  };

  return (
    <div
      className="desktop-nav-dropdown"
      style={
        {
          '--arrow-offset': `${arrowOffset}px`,
        } as React.CSSProperties
      }
    >
      {loading ? (
        <div className="desktop-nav-dropdown-loading">Loading...</div>
      ) : (
        <ul className="desktop-nav-dropdown-list">
          {items.map((item) => (
            <li key={item.id} className="desktop-nav-dropdown-item" onClick={() => handleClick(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DesktopNavDropdown;
