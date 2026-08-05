'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Eye, MapPin, Tag } from 'lucide-react';
import './Masonry.css';

export interface MasonryItem {
  id: string;
  img?: string;
  imageUrl?: string;
  url?: string;
  title: string;
  category?: string;
  description?: string;
  location?: string;
  height: number;
  [key: string]: any;
}

interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: MasonryItem) => void;
}

const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    const index = queries.findIndex((q) => window.matchMedia(q).matches);
    return values[index] ?? defaultValue;
  };

  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get);
    const mqls = queries.map((q) => window.matchMedia(q));
    mqls.forEach((mql) => mql.addEventListener('change', handler));
    return () => mqls.forEach((mql) => mql.removeEventListener('change', handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return value;
};

const useMeasure = (): [React.RefObject<HTMLDivElement>, { width: number; height: number }] => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

export default function Masonry({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.96,
  blurToFocus = true,
  colorShiftOnHover = true,
  onItemClick,
}: MasonryProps) {
  const columns = useMedia(
    ['(min-width: 1400px)', '(min-width: 1024px)', '(min-width: 640px)', '(min-width: 480px)'],
    [4, 3, 2, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (item: { x: number; y: number; w: number; h: number }) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'] as const;
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: 400 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: width + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    const urls = items
      .map((i) => i.img || i.imageUrl)
      .filter(Boolean) as string[];

    let isCancelled = false;
    const timer = setTimeout(() => {
      if (!isCancelled) setImagesReady(true);
    }, 600);

    if (urls.length > 0) {
      preloadImages(urls).then(() => {
        if (!isCancelled) setImagesReady(true);
      });
    } else {
      setImagesReady(true);
    }

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    return items.map((child, index) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      
      // Calculate dynamic aspect ratio height: 16:9 landscape, 1:1 square, or 9:16 portrait
      const format = child.aspectFormat || child.format || child.aspectRatio;
      let height: number;

      if (format === 'landscape' || format === '16:9') {
        height = Math.round(columnWidth * (9 / 16));
      } else if (format === 'square' || format === '1:1') {
        height = Math.round(columnWidth * 1.0);
      } else if (format === 'portrait' || format === '9:16' || format === '16:9-portrait') {
        height = Math.round(columnWidth * (16 / 9));
      } else {
        // Pattern sequence: Portrait (9:16), Landscape (16:9), Square (1:1)
        const pattern = [
          Math.round(columnWidth * (16 / 9)), // Portrait 9:16
          Math.round(columnWidth * (9 / 16)), // Landscape 16:9
          Math.round(columnWidth * 1.0),      // Square 1:1
          Math.round(columnWidth * (9 / 16)), // Landscape 16:9
          Math.round(columnWidth * (16 / 9)), // Portrait 9:16
          Math.round(columnWidth * 1.0),      // Square 1:1
        ];
        height = pattern[index % pattern.length];
      }

      const y = colHeights[col];
      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const maxContainerHeight = useMemo(() => {
    if (grid.length === 0) return 400;
    return Math.max(...grid.map((item) => item.y + item.h)) + 20;
  }, [grid]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady || grid.length === 0) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' }),
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease: 'power3.out',
          delay: index * stagger,
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: 'auto',
        });
      }
    });

    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="masonry-list"
      style={{ height: `${maxContainerHeight}px` }}
    >
      {grid.map((item) => {
        const imgSrc =
          item.img ||
          item.imageUrl ||
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop';

        return (
          <div
            key={item.id}
            data-key={item.id}
            className="masonry-item-wrapper group"
            onClick={() => onItemClick && onItemClick(item)}
            onMouseEnter={(e) => handleMouseEnter(e, item)}
            onMouseLeave={(e) => handleMouseLeave(e, item)}
          >
            <div className="masonry-item-img relative overflow-hidden bg-slate-900 w-full h-full">
              <img
                src={imgSrc}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop';
                }}
              />

              {colorShiftOnHover && <div className="masonry-color-overlay" />}

              {/* Badge Overlay Details */}
              <div className="masonry-info-badge space-y-1.5">
                {item.category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0086C9]/90 text-white backdrop-blur-md shadow-sm">
                    <Tag size={10} />
                    {item.category}
                  </span>
                )}
                <h3 className="text-sm font-extrabold text-white font-heading line-clamp-1 leading-snug drop-shadow-md">
                  {item.title}
                </h3>
                {item.location && (
                  <p className="text-[11px] text-slate-200 flex items-center gap-1 font-medium drop-shadow">
                    <MapPin size={11} className="text-amber-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                )}
                <div className="pt-1 flex items-center text-[10px] font-bold text-amber-300 gap-1">
                  <Eye size={12} />
                  <span>Klik untuk perbesar & detail</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
