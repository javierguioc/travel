// Componente Image optimizado con lazy loading y responsive
import { useState } from 'react';

export function Image({
  src,
  alt,
  className = '',
  fallback = '🏞️',
  aspectRatio = 'video', // 'square', 'video', 'portrait'
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  if (hasError || !src) {
    return (
      <div
        className={`
          ${aspectClasses[aspectRatio]}
          bg-dark-bgTertiary rounded-lg
          flex items-center justify-center
          text-6xl
          ${className}
        `}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div className={`relative ${aspectClasses[aspectRatio]} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-dark-bgTertiary rounded-lg animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
        className={`
          w-full h-full object-cover rounded-lg
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        {...props}
      />
    </div>
  );
}

export default Image;
