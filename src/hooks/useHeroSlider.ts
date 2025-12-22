import { useState, useEffect } from 'react';

interface UseHeroSliderOptions {
  slidesCount: number;
  autoAdvanceInterval?: number;
  transitionDuration?: number;
}

interface UseHeroSliderReturn {
  currentSlide: number;
  isSlideChanging: boolean;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

/**
 * Custom hook for managing hero slider state and transitions
 * @param slidesCount - Number of slides available
 * @param autoAdvanceInterval - Auto-advance interval in milliseconds (default: 8000ms)
 * @param transitionDuration - Transition animation duration in milliseconds (default: 300ms)
 */
export const useHeroSlider = ({
  slidesCount,
  autoAdvanceInterval = 8000,
  transitionDuration = 300,
}: UseHeroSliderOptions): UseHeroSliderReturn => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideChanging, setIsSlideChanging] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    if (slidesCount <= 1) return;

    const interval = setInterval(() => {
      setIsSlideChanging(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slidesCount);
        setIsSlideChanging(false);
      }, transitionDuration);
    }, autoAdvanceInterval);

    return () => clearInterval(interval);
  }, [slidesCount, autoAdvanceInterval, transitionDuration]);

  const goToSlide = (index: number) => {
    if (index === currentSlide || isSlideChanging || index < 0 || index >= slidesCount) {
      return;
    }
    setIsSlideChanging(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsSlideChanging(false);
    }, transitionDuration);
  };

  const nextSlide = () => {
    if (isSlideChanging || slidesCount <= 1) return;
    goToSlide((currentSlide + 1) % slidesCount);
  };

  const prevSlide = () => {
    if (isSlideChanging || slidesCount <= 1) return;
    goToSlide((currentSlide - 1 + slidesCount) % slidesCount);
  };

  return {
    currentSlide,
    isSlideChanging,
    goToSlide,
    nextSlide,
    prevSlide,
  };
};
