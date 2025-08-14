'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/app/components/maps/LeafletMap'), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

export default function LazyLeafletMap() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ minHeight: 400 }}>{show && <LeafletMap />}</div>;
}