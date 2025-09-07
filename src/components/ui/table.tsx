import React from "react";

export function TableExperience({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-400">
      <table className="w-full text-left border-separate border-spacing-y-2">
        {children}
      </table>
    </div>
  );
}
