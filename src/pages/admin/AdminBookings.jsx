import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Phone } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState(null);

  const load = useCallback(() => {
    base44.entities.Booking.list("-created_date", 200).then(setBookings);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await base44.entities.Booking.update(id, { status });
    load();
  };

  const remove = async (id) => {
    await base44.entities.Booking.delete(id);
    load();
  };

  if (!bookings) {
    return <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin mx-auto mt-20" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2933]">Bookings</h1>
        <p className="text-sm text-gray-500">{bookings.length} booking requests</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          No bookings yet — they'll appear here when customers book online.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-bold text-[#1F2933]">{b.customer_name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status] || ""}`}>
                    {b.status}
                  </span>
                  {b.estimated_price ? (
                    <span className="text-xs font-bold text-[#2E7D5F]">~${b.estimated_price}</span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {b.service} · {b.booking_date} · {b.time_slot} · {b.suburb}
                </p>
                {b.notes && <p className="text-xs text-gray-400 mt-1">"{b.notes}"</p>}
                <a href={`tel:${b.customer_phone}`} className="inline-flex items-center gap-1 text-xs text-[#2E7D5F] font-medium mt-1">
                  <Phone className="w-3 h-3" /> {b.customer_phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATUS_COLORS).map((s) => (
                      <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => remove(b.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}