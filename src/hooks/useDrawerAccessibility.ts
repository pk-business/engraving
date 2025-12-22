import { useEffect, useRef } from 'react';

interface UseDrawerAccessibilityOptions {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Custom hook for managing drawer accessibility features:
 * - Body scroll lock
 * - Focus management
 * - Escape key handling
 * - Click outside handling
 */
export const useDrawerAccessibility = ({
  isOpen,
  onClose,
}: UseDrawerAccessibilityOptions) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveRef = useRef<Element | null>(null);

  // Handle open/close effects
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousActiveRef.current = document.activeElement;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the close button after drawer opens
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to previously focused element
      if (previousActiveRef.current && (previousActiveRef.current as HTMLElement).focus) {
        (previousActiveRef.current as HTMLElement).focus();
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return {
    panelRef,
    closeBtnRef,
    handleBackdropClick,
  };
};
