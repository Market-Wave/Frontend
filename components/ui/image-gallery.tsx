'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MediaItem {
  id: number;
  url: string;
  mediaType: string;
  mediaView: string;
  sortOrder: number;
}

interface ImageGalleryProps {
  media: MediaItem[];
  alt: string;
  className?: string;
  showThumbnails?: boolean;
}

export function ImageGallery({ media, alt, className, showThumbnails = true }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!media || media.length === 0) {
    return null;
  }

  // Sort media by sortOrder
  const sortedMedia = [...media].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentMedia = sortedMedia[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? sortedMedia.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === sortedMedia.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  return (
    <>
      <div className={cn('relative', className)} onKeyDown={handleKeyDown} tabIndex={0}>
        {/* Main Image */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
          <Image
            src={currentMedia.url}
            alt={`${alt} - ${currentMedia.mediaView}`}
            fill
            className="object-cover cursor-pointer"
            onClick={() => setIsFullscreen(true)}
            priority={currentIndex === 0}
          />
          
          {/* Media Tag */}
          <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-md text-sm font-medium">
            {currentMedia.mediaView}
          </div>

          {/* Media Type Badge */}
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            {currentMedia.mediaType}
          </div>

          {/* Navigation Arrows */}
          {sortedMedia.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {sortedMedia.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-md text-sm">
              {currentIndex + 1} / {sortedMedia.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && sortedMedia.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {sortedMedia.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all',
                  currentIndex === index
                    ? 'border-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-400'
                )}
              >
                <Image
                  src={item.url}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            aria-label="Close fullscreen"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full p-8 flex items-center justify-center">
            <div className="relative w-full h-full max-w-7xl max-h-full">
              <Image
                src={currentMedia.url}
                alt={`${alt} - ${currentMedia.mediaView}`}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Media Info in Fullscreen */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                <p className="text-sm font-medium">{currentMedia.mediaView}</p>
                <p className="text-xs text-gray-300">
                  {currentIndex + 1} / {sortedMedia.length}
                </p>
              </div>
            </div>

            {sortedMedia.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
