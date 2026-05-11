import React, { useState, useEffect, useRef } from 'react';

/**
 * ContentTransition - Smooth entrance animation for loading content
 * Uses IntersectionObserver for performant scroll-triggered animations
 * Provides fade-in-up effect with staggered children
 */
const ContentTransition = ({
  children,
  delay = 0,
  duration = 500,
  threshold = 0.1,
  className = '',
  once = true,
  stagger = 100,
  as: Component = 'div'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (once && hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            hasAnimated.current = true;
          }, delay);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay, threshold, once]);

  const baseStyle = {
    opacity: 0,
    transform: 'translateY(20px)',
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
  };

  const visibleStyle = {
    opacity: 1,
    transform: 'translateY(0)'
  };

  return (
    <Component
      ref={elementRef}
      className={className}
      style={isVisible ? visibleStyle : baseStyle}
    >
      {children}
    </Component>
  );
};

/**
 * StaggerContainer - Applies staggered delays to children
 */
export const StaggerContainer = ({ children, stagger = 100, className = '' }) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <ContentTransition key={index} delay={index * stagger} duration={400}>
          {child}
        </ContentTransition>
      ))}
    </div>
  );
};

/**
 * FadeIn - Simple fade-in wrapper
 */
export const FadeIn = ({ children, delay = 0, duration = 400, className = '' }) => (
  <ContentTransition delay={delay} duration={duration} className={className}>
    {children}
  </ContentTransition>
);

export default ContentTransition;
