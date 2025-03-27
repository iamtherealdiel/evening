import React from 'react';
import { Sparkles } from 'lucide-react';

interface MediaCardProps {
  title: string;
  description: string;
  icon: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-[#1a1d1e] rounded-xl p-6 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden">
          <Sparkles className="w-full h-full text-white/90" />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-lg font-medium">{title}</h3>
          <p className="text-white/60 text-sm mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
      
      <div className="mt-6 flex gap-2">
        <div className="flex gap-4">
          <a
            href="https://mediatiger.co"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-white/95 text-black rounded-lg font-medium hover:bg-white transition-all duration-200"
          >
            Get Started
          </a>
          <a
            href="https://mediatiger.co"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-transparent border border-white/80 rounded-lg font-medium hover:bg-white/10 hover:border-white transition-all duration-200"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

const ExchangeSection = () => {
  return (
    <></>
  );
};

export default ExchangeSection;