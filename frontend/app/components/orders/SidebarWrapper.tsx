import React, { useState, useEffect } from 'react';

interface SidebarWrapperProps {
  isOpen: boolean;
  children: React.ReactElement<{ isOpen: boolean }>;
}

export default function SidebarWrapper({ isOpen, children }: SidebarWrapperProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimatingOpen, setIsAnimatingOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timeoutId = setTimeout(() => {
        setIsAnimatingOpen(true);
      }, 20);
      return () => clearTimeout(timeoutId);
    } else {
      setIsAnimatingOpen(false);
      const timeoutId = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  if (!React.isValidElement(children)) {
    return children;
  }

  return React.cloneElement(children, { isOpen: isAnimatingOpen });
}