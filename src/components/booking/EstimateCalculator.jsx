import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";
import { ESTIMATE_SERVICES, calcEstimate } from "./estimateData";

export default function EstimateCalculator({ onChange, initialService }) {
  const [service, setService] = useState(initialService || ESTIMATE_SERVICES[0].id);
  const [yardSize, setYardSize] = useState(400);
  const estimate = calcEstimate(service, yardSize);

  useEffect(() => {
    if (onChange) onChange({ service, yardSize, estimate });
  }, [service, yardSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#E8F3ED] rounded-xl flex items-center justify-center">
          <Calculator className="w-5 h-5 text-[#2E7D5F]" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2933]">Instant Estimate</h3>
      </div>

      <p className="text-sm font-medium text-[#1F2933] mb-3">What do you need?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {ESTIMATE_SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setService(s.id)}
            className={`px-4 py-3 rounded-xl text-sm font-medium text-left border transition-all ${
              service === s.id
                ? "border-[#2E7D5F] bg-[#E8F3ED] text-[#2E7D5F]"
                : "border-gray-200 text-[#1F2933] hover:border-[#2E7D5F]/40"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-baseline mb-3">
        <p className="text-sm font-medium text-[#1F2933]">How big is your yard?</p>
        <span className="text-sm font-bold text-[#2E7D5F]">{yardSize} m²</span>
      </div>
      <Slider
        value={[yardSize]}
        onValueChange={(v) => setYardSize(v[0])}
        min={100}
        max={2000}
        step={50}
        className="mb-2"
      />
      <div className="flex justify-between text-xs text-gray-400 mb-6">
        <span>Small (100m²)</span>
        <span>Large (2000m²)</span>
      </div>

      <div className="bg-[#F5F1EB] rounded-xl p-5 text-center">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Estimated price</p>
        <p className="text-3xl font-bold text-[#2E7D5F]">
          ${estimate.low} – ${estimate.high}
        </p>
        <p className="text-xs text-gray-500 mt-1">Final price confirmed after a quick look at your property</p>
      </div>
    </div>
  );
}