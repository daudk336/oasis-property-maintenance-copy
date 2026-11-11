import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Phone, Mail, Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MowingBackground from "@/components/three/MowingBackground";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", path: "Home" },
    { name: "Services", path: "Services" },
    { name: "Gallery", path: "Gallery" },
    { name: "About", path: "About" },
    { name: "FAQ", path: "FAQ" },
    { name: "Contact", path: "Contact" },
  ];

  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  if (location.pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen relative">
      <MowingBackground />
      <style>{`
        :root {
          --oasis-green: #2E7D5F;
          --light-sage: #E8F3ED;
          --sand: #F5F1EB;
          --charcoal: #1F2933;
          --accent: #F5A623;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center group">
              <img
                src="https://media.base44.com/images/public/6907475d81a975154143174e/aa271b98d_image.png"
                alt="Green Cut Lawn Care"
                className="h-16 w-auto transform group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-[#E8F3ED] text-[#2E7D5F]"
                      : "text-[#1F2933] hover:bg-[#E8F3ED]/50 hover:text-[#2E7D5F]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:+61400000000" className="flex items-center gap-2 text-sm text-[#1F2933] hover:text-[#2E7D5F] transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium">0400 000 000</span>
              </a>
              <Link to={createPageUrl("Booking")}>
                <Button className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white shadow-md">
                  Book Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6 text-[#1F2933]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 pb-6 border-b">
                    <img
                      src="https://media.base44.com/images/public/6907475d81a975154143174e/aa271b98d_image.png"
                      alt="Green Cut Lawn Care"
                      className="h-14 w-auto"
                    />
                  </div>

                  <nav className="flex flex-col gap-2 py-6 flex-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={createPageUrl(item.path)}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          isActive(item.path)
                            ? "bg-[#E8F3ED] text-[#2E7D5F]"
                            : "text-[#1F2933] hover:bg-[#E8F3ED]/50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t pt-6 space-y-3">
                    <a 
                      href="tel:+61400000000" 
                      className="flex items-center gap-3 px-4 py-3 bg-[#E8F3ED] rounded-lg text-[#2E7D5F] font-medium"
                    >
                      <Phone className="w-5 h-5" />
                      <span>0400 000 000</span>
                    </a>
                    <Link to={createPageUrl("Booking")} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Floating Mobile CTA */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <a href="tel:+61400000000">
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 shadow-2xl bg-[#2E7D5F] hover:bg-[#236B4F] border-4 border-white"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </a>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#1F2933] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D5F] to-[#236B4F] rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg">Green Cut</div>
                  <div className="text-xs text-[#E8F3ED]">Lawn Care</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Healthy lawns. Tidy homes. Reliable service.
              </p>
              <p className="text-xs text-gray-500">
                ABN: [To be registered]
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={createPageUrl(item.path)}
                      className="text-sm text-gray-400 hover:text-[#2E7D5F] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Lawn Mowing & Edging</li>
                <li>Garden Maintenance</li>
                <li>Pressure Washing</li>
                <li>Gutter Cleaning</li>
                <li>Property Maintenance</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
              <div className="space-y-3">
                <a href="tel:+61400000000" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#2E7D5F] transition-colors">
                  <Phone className="w-4 h-4" />
                  0400 000 000
                </a>
                <a href="mailto:info@greencutlawncare.com.au" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#2E7D5F] transition-colors">
                  <Mail className="w-4 h-4" />
                  info@greencutlawncare.com.au
                </a>
                <p className="text-sm text-gray-400 mt-4">
                  Gold Coast · Logan · South Brisbane
                </p>
                <p className="text-xs text-[#2E7D5F] font-medium mt-2">
                  Emergency/storm clean-up available
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Green Cut Lawn Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}