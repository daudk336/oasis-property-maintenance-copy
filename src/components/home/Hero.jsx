import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Star, MapPin, ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[86vh] flex items-center overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-2xl rounded-3xl p-8 md:p-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#E8F3ED] border border-[#2E7D5F]/20 rounded-full px-4 py-1.5 mb-6">
            <MapPin className="w-3.5 h-3.5 text-[#2E7D5F]" />
            <span className="text-xs font-semibold text-[#2E7D5F]">Gold Coast · Logan · South Brisbane</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#1F2933] leading-tight mb-6">
            Your property,
            <span className="block text-[#2E7D5F]">perfectly maintained.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Lawns, gardens, pressure washing and property care — booked online in under a minute, with instant price estimates.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/Booking">
              <Button size="lg" className="w-full sm:w-auto bg-[#2E7D5F] hover:bg-[#236B4F] text-white text-base px-8 h-13 shadow-lg">
                <CalendarCheck className="w-5 h-5 mr-2" />
                Book a Service
              </Button>
            </Link>
            <a href="#estimate">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white border-gray-200 text-[#1F2933] hover:bg-gray-50 text-base px-8 h-13">
                Get Instant Estimate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-4 mt-10 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
              ))}
            </div>
            <span className="text-sm text-gray-600">Trusted by homeowners across SE Queensland</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center bg-white/80 backdrop-blur-md rounded-full px-4 py-2 shadow-md text-[#2E7D5F]">
        <span className="text-xs font-semibold tracking-wide mb-0.5">Watch us work</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}