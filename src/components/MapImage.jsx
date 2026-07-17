import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

const MapImage = () => {
  return (
    <div className="min-h-screen bg-portfolio-bg pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="inline-flex items-center text-portfolio-muted hover:text-portfolio-gold transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back home
          </Link>

          <a
            href="/37of100_Map.png"
            download
            className="inline-flex items-center text-portfolio-muted hover:text-portfolio-gold transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        </div>

        <img
          src="/37of100_Map.png"
          alt="Map"
          className="w-full h-auto rounded-lg border border-portfolio-border shadow-lg"
        />
      </div>
    </div>
  );
};

export default MapImage;
