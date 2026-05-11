import React from 'react';

const Skeleton = ({
  variant = 'text',
  width = '100%',
  height = 'auto',
  className = '',
  count = 1,
  circle = false
}) => {
  const baseStyles = 'skeleton block';

  const variantStyles = {
    text: `h-4 ${height !== 'auto' ? `h-[${height}]` : ''}`,
    image: 'aspect-video rounded-lg',
    card: 'rounded-xl p-4',
    'list-item': 'h-16 rounded-lg',
    avatar: circle ? 'rounded-full' : 'rounded-lg',
    button: 'h-10 rounded-lg w-24',
    input: 'h-12 rounded-lg'
  };

  const inlineStyle = {
    width: Array.isArray(width) ? undefined : width,
    height: variantStyles[variant]?.includes('h-') ? undefined : height
  };

  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    width: Array.isArray(width) ? width[i] || width[0] : width
  }));

  if (count > 1) {
    return (
      <div className={`space-y-2 ${className}`} role="status" aria-label="Loading content">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${baseStyles} ${variantStyles[variant] || ''}`}
            style={{ width: item.width, ...(variant === 'text' ? { height: '1rem' } : {}) }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant] || ''} ${className}`}
      style={inlineStyle}
      role="status"
      aria-label="Loading content"
      aria-hidden="true"
    />
  );
};

/**
 * Pre-built skeleton blocks for complex layouts
 */
Skeleton.Card = ({ showImage = true, showTitle = true, showText = true }) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
    {showImage && <Skeleton variant="image" className="w-full" />}
    {showTitle && <Skeleton variant="text" width="70%" height="1.5rem" />}
    {showText && (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </>
    )}
  </div>
);

Skeleton.List = ({ items = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
        <Skeleton variant="avatar" className="w-12 h-12 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="70%" className="text-xs" />
        </div>
      </div>
    ))}
  </div>
);

Skeleton.Grid = ({ columns = 4, rows = 1 }) => {
  const gridCols = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`;
  return (
    <div className={`grid ${gridCols} gap-6`}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <Skeleton key={i} variant="image" className="aspect-[4/5] rounded-2xl" />
      ))}
    </div>
  );
};

Skeleton.Form = ({ fields = 3 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton variant="text" width="30%" height="0.875rem" />
        <Skeleton variant="input" />
      </div>
    ))}
  </div>
);

export default Skeleton;

