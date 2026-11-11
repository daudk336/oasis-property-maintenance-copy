import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Phone } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2E7D5F]/95 to-[#1d5942]/95 backdrop-blur-md border border-white/20 shadow-xl px-8 py-16 text-center">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for a healthier, tidier property?
          </h2>
          <p className="text-[#C9E5D8] max-w-xl mx-auto mb-8">
            Book online in under a minute, or give us a call — we'll take care of the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/Booking">
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#2E7D5F] hover:bg-gray-100 text-base px-8 shadow-xl">
                <CalendarCheck className="w-5 h-5 mr-2" />
                Book Now
              </Button>
            </Link>
            <a href="tel:+61400000000">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 bg-transparent text-white hover:bg-white/10 text-base px-8">
                <Phone className="w-5 h-5 mr-2" />
                0400 000 000
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}