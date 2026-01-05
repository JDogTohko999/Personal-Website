import React from 'react';

const ArtisticAccents = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden hidden md:block">
      {/* Top Left Corner */}
      <div className="absolute top-4 left-4 w-32 h-32 opacity-80">
        <svg w="100%" h="100%" viewBox="0 0 100 100" fill="none" className="text-portfolio-gold transition-colors duration-300">
          <path d="M2 2 L30 2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 2 L2 30" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-4 right-4 w-32 h-32 opacity-80">
        <svg w="100%" h="100%" viewBox="0 0 100 100" fill="none" className="text-portfolio-gold transition-colors duration-300">
          <path d="M98 2 L70 2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M98 2 L98 30" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="98" cy="2" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-4 left-4 w-32 h-32 opacity-80">
        <svg w="100%" h="100%" viewBox="0 0 100 100" fill="none" className="text-portfolio-gold transition-colors duration-300">
          <path d="M2 98 L30 98" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 98 L2 70" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="2" cy="98" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-4 right-4 w-32 h-32 opacity-80">
        <svg w="100%" h="100%" viewBox="0 0 100 100" fill="none" className="text-portfolio-gold transition-colors duration-300">
          <path d="M98 98 L70 98" stroke="currentColor" strokeWidth="1.5" />
          <path d="M98 98 L98 70" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="98" cy="98" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Side Decorative Lines */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-gradient-to-b from-transparent via-portfolio-gold to-transparent opacity-40"></div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-gradient-to-b from-transparent via-portfolio-gold to-transparent opacity-40"></div>
    </div>
  );
};

export default ArtisticAccents;
