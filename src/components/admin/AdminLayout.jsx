import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, CalendarCheck, Users, CalendarDays,
  FileText, MessageSquare, Star, Leaf, ArrowLeft, ShieldAlert,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
  { name: "Clients", path: "/admin/clients", icon: Users },
  { name: "Schedule", path: "/admin/schedule", icon: CalendarDays },
  { name: "Invoices", path: "/admin/invoices", icon: FileText },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Reviews", path: "/admin/reviews", icon: Star },
];

export default function AdminLayout() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F5F1EB]">
        <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F1EB] px-4 text-center">
        <ShieldAlert className="w-12 h-12 text-[#2E7D5F] mb-4" />
        <h1 className="text-xl font-bold text-[#1F2933] mb-2">Admin access only</h1>
        <p className="text-sm text-gray-500 mb-6">You need an admin account to view this area.</p>
        <Link to="/">
          <Button className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to website
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#1F2933] text-white fixed inset-y-0">
        <div className="flex items-center gap-2 px-6 h-20 border-b border-white/10">
          <div className="w-9 h-9 bg-gradient-to-br from-[#2E7D5F] to-[#236B4F] rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm">FreshCut Admin</div>
            <div className="text-[10px] text-gray-400">Business Manager</div>
          </div>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-[#2E7D5F] text-white" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to website
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-[#1F2933] text-white">
        <div className="flex items-center gap-2 px-4 h-14">
          <Leaf className="w-5 h-5 text-[#2E7D5F]" />
          <span className="font-bold text-sm">FreshCut Admin</span>
          <Link to="/" className="ml-auto text-xs text-gray-400">Exit</Link>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                location.pathname === item.path ? "bg-[#2E7D5F] text-white" : "text-gray-300 bg-white/10"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <main className="flex-1 md:ml-64 pt-28 md:pt-8 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}