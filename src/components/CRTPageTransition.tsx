"use client";
import React, { useEffect, useState } from 'react';

export default function CRTPageTransition({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Trigger animation on mount
    setIsLoading(false);
  }, []);

  return (
    <div className={`${isLoading ? 'crt-turn-off' : 'crt-turn-on'} crt-flicker-continuous`}>
      {children}
    </div>
  );
}
