import React from 'react';
import ReactDOM from 'react-dom';
import { useDrawerAccessibility } from '../../hooks/useDrawerAccessibility';
import './Drawer.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  footer?: React.ReactNode;
}

/**
 * Reusable drawer component with built-in accessibility features
 * Handles portal rendering, backdrop, close button, and accessibility
 */
const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'left',
  footer,
}) => {
  const { panelRef, closeBtnRef, handleBackdropClick } = useDrawerAccessibility({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  const drawerContent = (
    <div className="drawer-root">
      <div className="drawer-backdrop" onClick={handleBackdropClick} />
      <div
        ref={panelRef}
        className={`drawer drawer-${position}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <h2 id="drawer-title">{title}</h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="drawer-close-btn"
            aria-label="Close drawer"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">{children}</div>

        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(drawerContent, document.body);
};

export default Drawer;
