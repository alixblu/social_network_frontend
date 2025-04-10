import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
