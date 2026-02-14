"use client";
import React from 'react';

export default function CRTPageTransition({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
