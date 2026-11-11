import React from "react";
import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Droplets } from "lucide-react";

function weatherMeta(code) {
  if (code === 0) return { Icon: Sun, label: "Sunny", color: "text-amber-500" };
  if (code <= 2) return { Icon: CloudSun, label: "Partly cloudy", color: "text-amber-400" };
  if (code === 3) return { Icon: Cloud, label: "Overcast", color: "text-gray-400" };
  if (code <= 48) return { Icon: CloudFog, label: "Foggy", color: "text-gray-400" };
  if (code <= 57) return { Icon: CloudDrizzle, label: "Drizzle", color: "text-sky-400" };
  if (code <= 67 || (code >= 80 && code <= 82)) return { Icon: CloudRain, label: "Rain", color: "text-sky-500" };
  if (code <= 86) return { Icon: CloudSnow, label: "Snow", color: "text-sky-300" };
  return { Icon: CloudLightning, label: "Storms", color: "text-purple-500" };
}

export default function WeatherBadge({ day, compact = false }) {
  if (!day) return null;
  const { Icon, label, color } = weatherMeta(day.code);

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        {day.tmax}°
        {day.rain >= 30 && (
          <span className="flex items-center gap-0.5 text-sky-500">
            <Droplets className="w-3 h-3" /> {day.rain}%
          </span>
        )}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-[#E8F3ED]/60 border border-[#2E7D5F]/15 rounded-xl px-4 py-3">
      <Icon className={`w-8 h-8 ${color}`} />
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#1F2933]">{label}</p>
        <p className="text-xs text-gray-500">
          {day.tmin}° – {day.tmax}° · {day.rain}% chance of rain
        </p>
      </div>
    </div>
  );
}