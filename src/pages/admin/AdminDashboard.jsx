import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import StatCard from "@/components/admin/StatCard";
import MonthlySummary from "@/components/admin/MonthlySummary";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarCheck, FileText, CalendarDays } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Booking.list("-created_date", 100),
      base44.entities.Client.list("-created_date", 200),
      base44.entities.Invoice.list("-created_date", 200),
      base44.entities.Job.list("date", 200),
    ]).then(([bookings, clients, invoices, jobs]) => {
      setData({ bookings, clients, invoices, jobs });
    });
  }, []);

  if (!data) {
    return <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin mx-auto mt-20" />;
  }

  const pendingBookings = data.bookings.filter((b) => b.status === "pending");
  const unpaid = data.invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const today = format(new Date(), "yyyy-MM-dd");
  const upcomingJobs = data.jobs.filter((j) => j.status === "scheduled" && j.date >= today);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2933]">Dashboard</h1>
        <p className="text-sm text-gray-500">Your business at a glance</p>
      </div>

      <MonthlySummary jobs={data.jobs} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} label="Pending bookings" value={pendingBookings.length} />
        <StatCard icon={Users} label="Clients" value={data.clients.length} />
        <StatCard icon={CalendarDays} label="Upcoming jobs" value={upcomingJobs.length} />
        <StatCard icon={FileText} label="Unpaid invoices" value={unpaid.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1F2933]">New booking requests</h2>
            <Link to="/admin/bookings" className="text-xs font-semibold text-[#2E7D5F]">View all</Link>
          </div>
          {pendingBookings.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No pending bookings</p>
          ) : (
            <div className="space-y-3">
              {pendingBookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#1F2933]">{b.customer_name}</p>
                    <p className="text-xs text-gray-500">{b.service} · {b.booking_date} · {b.time_slot}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">pending</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1F2933]">Upcoming jobs</h2>
            <Link to="/admin/schedule" className="text-xs font-semibold text-[#2E7D5F]">View schedule</Link>
          </div>
          {upcomingJobs.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No jobs scheduled</p>
          ) : (
            <div className="space-y-3">
              {upcomingJobs.slice(0, 5).map((j) => (
                <div key={j.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#1F2933]">{j.client_name}</p>
                    <p className="text-xs text-gray-500">{j.service} · {j.date}{j.time_slot ? ` · ${j.time_slot}` : ""}</p>
                  </div>
                  {j.price ? <span className="text-sm font-bold text-[#2E7D5F]">${j.price}</span> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}