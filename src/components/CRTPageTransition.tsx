"use client";
import React from 'react';

export default function CRTPageTransition({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="crt-turn-on crt-flicker-continuous w-full">
      {children}
    </div>
  );
}
