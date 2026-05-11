import React from 'react';

const Loader = ({
  size = 48,
  variant = 'default',
  className = '',
  label = 'Loading...',
  color = 'indigo'
}) => {
  const sizeMap = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-20 h-20',
  };

  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-600 text-indigo-500 border-t-indigo-500',
    blue: 'from-blue-500 to-cyan-500 text-blue-500 border-t-blue-500',
    white: 'from-white to-gray-300 text-white border-t-white',
    emerald: 'from-emerald-500 to-teal-500 text-emerald-500 border-t-emerald-500'
  };

  const colorClass = colorClasses[color] || colorClasses.indigo;

  // Faster, snappier animation constants
  const spinAnim = 'smooth-spin 0.6s cubic-bezier(0.4, 0, 0.2, 1) infinite';
  const pulseAnim = 'pulse-glow 0.8s ease-in-out infinite';

  const renderLoader = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className={`${sizeMap[size] || ''} ${className}`} style={{ width: size, height: size }} role="status">
            <svg viewBox="0 0 50 50" className="w-full h-full">
              <circle
                cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"
                strokeLinecap="round" strokeDasharray="90, 150"
                className={colorClass.split(' ')[0]}
                style={{ animation: spinAnim, transformOrigin: 'center' }}
              />
            </svg>
          </div>
        );

      case 'dots':
        return (
          <div className={`flex items-center gap-1 ${className}`} role="status">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-full bg-gradient-to-r ${colorClass} w-2 h-2`}
                style={{
                  animation: 'bounce-pulse 0.5s ease-in-out infinite',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <div className={`relative ${className}`} style={{ width: size, height: size }} role="status">
            <div
              className={`absolute inset-0 rounded-full border-4 border-gray-200/20 border-t-current ${colorClass.split(' ')[2]}`}
              style={{ animation: spinAnim }}
            />
            <div
              className={`absolute inset-2 rounded-full bg-gradient-to-tr ${colorClass} opacity-80`}
              style={{ animation: pulseAnim, filter: 'blur(2px)' }}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderLoader()}
      {label && <span className="text-sm font-medium text-gray-500 animate-pulse">{label}</span>}
    </div>
  );
};

export default Loader;