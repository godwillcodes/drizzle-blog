"use client";

import React from "react";

export default function ArticleLoading() {
  return (
    <div className="max-w-3xl mx-auto py-24 px-6">
      <div className="h-10 bg-gray-700 rounded w-3/4 mb-6 animate-pulse"></div>
      <div className="h-6 bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-700 rounded w-full animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
