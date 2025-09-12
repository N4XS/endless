import { SafariCompatibleImage } from './SafariCompatibleImage';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const LazyImage = ({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  loading = 'lazy',
  fetchPriority = 'auto'
}: LazyImageProps) => {
  return (
    <SafariCompatibleImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
    />
  );
};