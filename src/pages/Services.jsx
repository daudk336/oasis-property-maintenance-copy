import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  Scissors,
  Droplets,
  Wind,
  Home as HomeIcon,
  Truck,
  Wrench,
  Building2,
  CheckCircle2,
  ArrowRight,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
  const [selectedServices, setSelectedServices] = useState([]);

  const services = [
    {
      category: "Lawn & Garden Care",
      icon: Leaf,
      color: "from-green-500 to-emerald-600",
      items: [
        {
          id: "lawn-mowing",
          icon: Leaf,
          name: "Lawn Mowing & Edging",
          description: "Professional mowing with clean edges, blow down, and optional clippings removal. Prices depend on block size & access.",
          details: [
            "Push or ride-on mowing depending on property size",
            "Precise edging along paths and garden beds",
            "Blow down of hard surfaces",
            "Clippings removed or mulched on-site",
            "Small residential lawns from $45-$65"
          ],
          image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600"
        },
        {
          id: "whipper-snipping",
          icon: Scissors,
          name: "Whipper Snipping",
          description: "Trim hard-to-reach areas, edges, and overgrown sections with precision.",
          details: [
            "Around fences, trees, and obstacles",
            "Steep banks and difficult terrain",
            "Clear overgrown areas",
            "Perfect finish every time"
          ],
          image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"
        },
        {
          id: "garden-tidy",
          icon: Leaf,
          name: "Garden Tidy-Ups",
          description: "Seasonal clean-ups, weeding, and general garden maintenance to keep your space looking fresh.",
          details: [
            "Weeding and dead-heading",
            "Leaf and debris removal",
            "Garden bed maintenance",
            "Seasonal clean-ups"
          ],
          image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600"
        },
        {
          id: "hedge-trimming",
          icon: Scissors,
          name: "Hedge & Shrub Trimming",
          description: "Keep hedges shaped and safe from overgrowth with professional trimming services.",
          details: [
            "Formal and informal hedge shaping",
            "Height and width reduction",
            "Privacy hedge maintenance",
            "Native and exotic species"
          ],
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
        },
        {
          id: "mulch",
          icon: Leaf,
          name: "Mulch Top-Ups",
          description: "Fresh mulch application to keep garden beds healthy and weed-free.",
          details: [
            "Various mulch types available",
            "Weed suppression",
            "Moisture retention",
            "Professional application"
          ],
          image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600"
        }
      ]
    },
    {
      category: "Exterior Cleaning",
      icon: Droplets,
      color: "from-blue-500 to-cyan-600",
      items: [
        {
          id: "pressure-washing",
          icon: Droplets,
          name: "Pressure Washing",
          description: "High-pressure cleaning for driveways, paths, patios and pool areas. Perfect for removing mould and grime.",
          details: [
            "Driveway and path cleaning",
            "Patio and outdoor entertaining areas",
            "Pool surrounds",
            "Mouldy surfaces restored",
            "Great before selling or open homes"
          ],
          image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600"
        },
        {
          id: "soft-wash",
          icon: Wind,
          name: "Soft Wash",
          description: "Gentle cleaning solution for delicate outdoor surfaces and painted areas.",
          details: [
            "Safe for rendered surfaces",
            "House exterior washing",
            "Fence cleaning",
            "No damage to paintwork"
          ],
          image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"
        },
        {
          id: "gutter-cleaning",
          icon: HomeIcon,
          name: "Gutter Cleaning",
          description: "Prevent roof and water damage with professional gutter cleaning - perfect before storm season.",
          details: [
            "Full gutter and downpipe cleaning",
            "Leaf and debris removal",
            "Single-storey properties",
            "Storm season preparation",
            "Photo evidence provided"
          ],
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600"
        }
      ]
    },
    {
      category: "Property & General Maintenance",
      icon: HomeIcon,
      color: "from-amber-500 to-orange-600",
      items: [
        {
          id: "green-waste",
          icon: Truck,
          name: "Green Waste Removal",
          description: "Same-day removal where possible. We take it away so you don't have to deal with it.",
          details: [
            "Same-day removal available",
            "All garden waste",
            "Storm debris",
            "Load and haul service",
            "Proper disposal"
          ],
          image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600"
        },
        {
          id: "bond-tidy",
          icon: HomeIcon,
          name: "Rental / Bond Tidy",
          description: "End-of-lease garden and outdoor tidy-ups to help you get your bond back.",
          details: [
            "Full property tidy",
            "Lawn mowing and edging",
            "Garden bed cleaning",
            "Hard surface cleaning",
            "Rubbish removal"
          ],
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
        },
        {
          id: "handyman",
          icon: Wrench,
          name: "Small Handyman Tasks",
          description: "Minor repairs and maintenance - door fixes, gate repairs, outdoor lights, letterbox repair.",
          details: [
            "Gate and door adjustments",
            "Outdoor light replacement",
            "Letterbox repairs",
            "Fence minor repairs",
            "Small fixing jobs"
          ],
          image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600"
        },
        {
          id: "strata",
          icon: Building2,
          name: "Strata & Body Corporate",
          description: "Regular maintenance visits for common areas and grounds of body corporate properties.",
          details: [
            "Common area maintenance",
            "Regular scheduled visits",
            "Gardens and lawns",
            "Pathways and access",
            "Consistent quality service"
          ],
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600"
        }
      ]
    }
  ];

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2E7D5F]/90 to-[#236B4F]/90 backdrop-blur-md text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              From weekly lawn care to complete property maintenance - we offer comprehensive services to keep your outdoor spaces beautiful and functional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services by Category */}
      {services.map((category, categoryIndex) => (
        <section key={category.category} className={categoryIndex % 2 === 0 ? "bg-white/80 backdrop-blur-md py-20" : "py-20"}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2933]">
                {category.category}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {category.items.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          onClick={() => toggleService(service.id)}
                          className={`shadow-lg ${
                            selectedServices.includes(service.id)
                              ? "bg-[#2E7D5F] hover:bg-[#236B4F]"
                              : "bg-white text-[#2E7D5F] hover:bg-gray-100"
                          }`}
                        >
                          {selectedServices.includes(service.id) ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Add to Quote
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#1F2933] mb-2">
                            {service.name}
                          </h3>
                          <p className="text-gray-600">{service.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {service.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-[#2E7D5F] flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* NDIS Section */}
      <section className="py-20 bg-white/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-[#2E7D5F]/20 shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D5F] to-[#236B4F] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2933] mb-4">
                    NDIS & Support Homes
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    We work with support coordinators to keep outdoor areas safe and accessible – lawns, path clearing, green waste and outdoor cleaning. Regular maintenance helps create safe, welcoming environments for participants.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D5F]" />
                      <span>Safety-focused maintenance</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D5F]" />
                      <span>Clear pathways and access</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-[#2E7D5F]" />
                      <span>Work with coordinators</span>
                    </div>
                  </div>
                  <Link to={createPageUrl("Contact")}>
                    <Button size="lg" className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
                      Request a Site Visit
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2E7D5F] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-4"
          >
            <div>
              <div className="font-semibold">{selectedServices.length} services selected</div>
              <div className="text-xs text-white/80">Get a quote for your selection</div>
            </div>
            <Link to={createPageUrl("Contact")}>
              <Button className="bg-white text-[#2E7D5F] hover:bg-gray-100">
                Get Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      )}

      {/* Final CTA */}
      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2933] mb-6">
            Need something else?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            If you don't see what you need, just ask. We handle all kinds of property maintenance jobs across SE Queensland.
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button size="lg" className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white shadow-lg text-lg px-8">
              Get in Touch
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}