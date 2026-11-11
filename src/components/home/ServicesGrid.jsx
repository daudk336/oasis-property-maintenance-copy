import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Flower2, Droplets, Home as HomeIcon, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Scissors,
    title: "Lawn Mowing & Edging",
    description: "Regular mowing, crisp edges and clippings removed — your lawn always guest-ready.",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80",
  },
  {
    icon: Flower2,
    title: "Garden Maintenance",
    description: "Weeding, pruning, hedging and mulching to keep every garden bed thriving.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    icon: Droplets,
    title: "Pressure Washing",
    description: "Driveways, patios and exteriors restored to like-new with professional equipment.",
    image: "https://images.unsplash.com/photo-1610476840960-b309a3116da2?w=800&q=80",
  },
  {
    icon: HomeIcon,
    title: "Property Maintenance",
    description: "Gutter cleaning, minor repairs and full tidy-ups — one call covers it all.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
  },
];

export default function ServicesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/85 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl p-8 md:p-14">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-[#2E7D5F] uppercase tracking-wider mb-2">What we do</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2933]">Everything your property needs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, idx) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="w-10 h-10 bg-[#E8F3ED] rounded-xl flex items-center justify-center mb-4">
                <service.icon className="w-5 h-5 text-[#2E7D5F]" />
              </div>
              <h3 className="font-bold text-[#1F2933] mb-2">{service.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link to="/Services" className="inline-flex items-center gap-2 text-[#2E7D5F] font-semibold hover:gap-3 transition-all">
          View all services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      </div>
    </section>
  );
}