import React from "react";

export default function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent || "bg-[#E8F3ED]"}`}>
          <Icon className="w-5 h-5 text-[#2E7D5F]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#1F2933] leading-none">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}