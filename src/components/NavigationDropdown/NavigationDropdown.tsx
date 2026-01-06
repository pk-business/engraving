import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { getAllTaxonomies, type TaxonomyItem } from '../../services/taxonomy.service';
import { ROUTES } from '../../constants';
import './NavigationDropdown.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationDropdown: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<TaxonomyItem[]>([]);
  const [occasions, setOccasions] = useState<TaxonomyItem[]>([]);
  const [productCategories, setProductCategories] = useState<TaxonomyItem[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { materials: mats, occasions: occs, productCategories: cats } = await getAllTaxonomies();
        if (!mounted) return;
        setMaterials(mats);
        setOccasions(occs);
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

  const handleNavigation = (type: 'material' | 'occasion' | 'category', slug: string) => {
    const params = new URLSearchParams();
    if (type === 'material') {
      params.append('materials', slug);
    } else if (type === 'occasion') {
      params.append('occasions', slug);
    } else if (type === 'category') {
      params.append('productCategories', slug);
    }
    navigate(`${ROUTES.PRODUCTS}?${params.toString()}`);
    onClose();
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="navigation-dropdown">
      <div className="navigation-dropdown-content">
        {loading ? (
          <div className="navigation-dropdown-loading">Loading...</div>
        ) : (
          <>
            {/* Products/Categories Section */}
            <div className="nav-dropdown-section">
              <button className="nav-dropdown-section-header" onClick={() => toggleSection('products')}>
                <span>Products</span>
                {expandedSection === 'products' ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              {expandedSection === 'products' && (
                <div className="nav-dropdown-section-items">
                  {productCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className="nav-dropdown-item"
                      onClick={() => handleNavigation('category', cat.slug || cat.name)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Occasion Section */}
            <div className="nav-dropdown-section">
              <button className="nav-dropdown-section-header" onClick={() => toggleSection('occasion')}>
                <span>Occasion</span>
                {expandedSection === 'occasion' ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              {expandedSection === 'occasion' && (
                <div className="nav-dropdown-section-items">
                  {occasions.map((occ) => (
                    <button
                      key={occ.id}
                      className="nav-dropdown-item"
                      onClick={() => handleNavigation('occasion', occ.slug || occ.name)}
                    >
                      {occ.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Material Section */}
            <div className="nav-dropdown-section">
              <button className="nav-dropdown-section-header" onClick={() => toggleSection('material')}>
                <span>Material</span>
                {expandedSection === 'material' ? <FiChevronDown /> : <FiChevronRight />}
              </button>
              {expandedSection === 'material' && (
                <div className="nav-dropdown-section-items">
                  {materials.map((mat) => (
                    <button
                      key={mat.id}
                      className="nav-dropdown-item"
                      onClick={() => handleNavigation('material', mat.slug || mat.name)}
                    >
                      {mat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavigationDropdown;
