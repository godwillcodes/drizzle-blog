import React from "react";

export default function BlogLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-16 p-6 max-w-7xl mx-auto my-16">
      {Array.from({ length:12 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col p-4 rounded-2xl bg-gray-800 animate-pulse h-40"
        >
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-full flex-grow"></div>
        </div>
      ))}
    </div>
  );
}
