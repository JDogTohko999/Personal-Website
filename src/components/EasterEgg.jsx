import React, { useState, useRef, useEffect } from 'react';
import { Egg, ChevronLeft, ChevronRight } from 'lucide-react';

const EasterEgg = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hoverTimerRef = useRef(null);
  const fadeOutTimerRef = useRef(null);

  const images = [
    '/jason_volleyball_squirrel.JPG',
    '/banana.jpg',
    '/garfield_tundy.jpg',
  ];

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
    if (!isVisible) {
      hoverTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (isVisible) {
      fadeOutTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const closeModal = () => {
    setShowImage(false);
    setCurrentIndex(0);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    };
  }, []);

  const isClickable = isVisible && isHovering;

  return (
    <>
      {/* Invisible hover trigger area */}
      <div
        className="fixed top-0 left-0 w-16 h-16 z-50 cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Easter egg button that fades in/out */}
        <button
          onClick={() => isClickable && setShowImage(true)}
          className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${
            isVisible && isHovering
              ? 'opacity-100 cursor-pointer'
              : isVisible
              ? 'opacity-30 cursor-default'
              : 'opacity-0 cursor-default'
          } ${!isClickable ? 'pointer-events-none' : ''}`}
          title={isClickable ? "You found me!" : ""}
        >
          <Egg className="w-8 h-8 text-portfolio-gold" />
        </button>
      </div>

      {/* Image modal with gallery */}
      {showImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-2xl max-h-[80vh] flex flex-col items-center">
            {/* Navigation buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center -ml-12">
              <button
                onClick={prevImage}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center -mr-12">
              <button
                onClick={nextImage}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Caption */}
            <p className="text-white text-lg font-medium mb-3">first yr fits</p>

            {/* Image */}
            <img
              src={images[currentIndex]}
              alt="Easter egg"
              className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Dots indicator */}
            <div className="flex gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-portfolio-gold' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            <p className="text-white text-center mt-3 text-sm opacity-70">
              Click outside to close
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EasterEgg;
