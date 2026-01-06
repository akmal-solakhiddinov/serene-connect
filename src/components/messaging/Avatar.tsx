import { cn } from '@/lib/utils';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const indicatorSizes = {
  sm: 'w-2.5 h-2.5 border-[2px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
};

export const Avatar = ({ src, alt, size = 'md', online, className }: AvatarProps) => {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          sizeClasses[size],
          'rounded-full object-cover ring-2 ring-background shadow-sm'
        )}
      />
      {online !== undefined && (
        <span
          className={cn(
            indicatorSizes[size],
            'absolute bottom-0 right-0 rounded-full border-background',
            online ? 'bg-online' : 'bg-muted-foreground'
          )}
        />
      )}
    </div>
  );
};
