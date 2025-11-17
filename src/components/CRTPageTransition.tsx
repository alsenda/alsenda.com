"use client";
import React, { useEffect, useState } from 'react';

export default function CRTPageTransition({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger turn-on animation on mount
    setAnimate(true);
  }, []);

  return (
    <div className={`${animate ? 'crt-turn-on' : ''} crt-flicker-continuous`}>
      {children}
    </div>
  );
}
