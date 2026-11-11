import React from "react";
import { DollarSign, Home } from "lucide-react";
import { format } from "date-fns";

export default function MonthlySummary({ jobs }) {
  const monthPrefix = format(new Date(), "yyyy-MM");
  const completed = jobs.filter((j) => j.status === "completed" && j.date?.startsWith(monthPrefix));
  const revenue = completed.reduce((sum, j) => sum + (j.price || 0), 0);
  const properties = new Set(completed.map((j) => (j.address || j.client_name || "").toLowerCase())).size;

  return (
    <div className="bg-gradient-to-br from-[#2E7D5F] to-[#236B4F] rounded-2xl shadow-md p-6 text-white">
      <p className="text-xs uppercase tracking-wider text-white/70 mb-4">
        {format(new Date(), "MMMM")} summary
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-3xl font-bold leading-none">${revenue.toLocaleString()}</p>
            <p className="text-xs text-white/70 mt-1">Revenue from completed jobs</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <p className="text-3xl font-bold leading-none">{properties}</p>
            <p className="text-xs text-white/70 mt-1">Properties serviced</p>
          </div>
        </div>
      </div>
    </div>
  );
}