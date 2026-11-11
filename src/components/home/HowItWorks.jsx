import React from "react";
import { motion } from "framer-motion";
import { Calculator, CalendarDays, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Calculator,
    title: "Get your estimate",
    description: "Tell us your yard size and service — see your price range instantly, no waiting.",
  },
  {
    icon: CalendarDays,
    title: "Pick your date",
    description: "Choose a day and time slot that suits you with our online booking calendar.",
  },
  {
    icon: Sparkles,
    title: "We make it shine",
    description: "Our team arrives on time, does the job properly, and leaves your place spotless.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/85 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl p-8 md:p-14">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#2E7D5F] uppercase tracking-wider mb-2">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933]">Booked in three simple steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative text-center px-6"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D5F] to-[#236B4F] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-7 h-7 bg-[#F5A623] text-white text-sm font-bold rounded-full flex items-center justify-center">
                {idx + 1}
              </div>
              <h3 className="font-bold text-lg text-[#1F2933] mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}