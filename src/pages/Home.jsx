import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import HomeCTA from "@/components/home/HomeCTA";
import EstimateCalculator from "@/components/booking/EstimateCalculator";

export default function Home() {
  return (
    <div>
      <Hero />
      <ServicesGrid />
      <HowItWorks />

      {/* Estimate calculator */}
      <section id="estimate" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/85 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold text-[#2E7D5F] uppercase tracking-wider mb-2">Instant pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933] mb-4">
              Know your price before you book
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              No waiting for callbacks. Slide to your yard size, pick a service, and get an honest
              price range on the spot. Happy with it? Book your date in the next step.
            </p>
            <Link to="/Booking">
              <Button size="lg" className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white px-8">
                <CalendarCheck className="w-5 h-5 mr-2" />
                Book with this estimate
              </Button>
            </Link>
          </div>
          <EstimateCalculator />
        </div>
      </section>

      <HomeCTA />
    </div>
  );
}