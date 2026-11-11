export const ESTIMATE_SERVICES = [
  { id: "Lawn Mowing & Edging", name: "Lawn Mowing & Edging", base: 45, rate: 0.06 },
  { id: "Garden Maintenance", name: "Garden Maintenance", base: 60, rate: 0.05 },
  { id: "Pressure Washing", name: "Pressure Washing", base: 80, rate: 0.15 },
  { id: "Gutter Cleaning", name: "Gutter Cleaning", base: 90, rate: 0.04 },
  { id: "Full Property Tidy-Up", name: "Full Property Tidy-Up", base: 120, rate: 0.12 },
];

export const TIME_SLOTS = ["8am-10am", "10am-12pm", "12pm-2pm", "2pm-4pm", "4pm-6pm"];

export function calcEstimate(serviceId, yardSize) {
  const service = ESTIMATE_SERVICES.find((s) => s.id === serviceId);
  if (!service) return null;
  const mid = service.base + service.rate * yardSize;
  return {
    low: Math.round((mid * 0.85) / 5) * 5,
    high: Math.round((mid * 1.15) / 5) * 5,
    mid: Math.round(mid),
  };
}