import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  Shield,
  Users,
  Leaf,
  ArrowRight,
  MapPin,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const values = [
    {
      icon: Clock,
      title: "Reliable & Punctual",
      description: "We send reminders, we show up on the day, and we keep notes on your property so the next visit is faster."
    },
    {
      icon: Shield,
      title: "Professional & Insured",
      description: "Fully insured with public liability. We take our work seriously and protect your property."
    },
    {
      icon: Users,
      title: "Local & Trusted",
      description: "Not a random Facebook guy. We're a legitimate local business you can rely on year-round."
    },
    {
      icon: Heart,
      title: "Customer Focused",
      description: "We listen, we communicate clearly, and we make sure you're happy with every visit."
    }
  ];

  const serviceAreas = {
    "Gold Coast": ["Parkwood", "Arundel", "Helensvale", "Coomera", "Pimpama", "Southport", "Robina"],
    "Logan": ["Shailer Park", "Daisy Hill", "Springwood", "Beenleigh", "Loganholme", "Underwood"],
    "South Brisbane": ["Eight Mile Plains", "Sunnybank", "Calamvale", "Stretton", "Kuraby"]
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
              About Green Cut
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Local, reliable, not a random Facebook guy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://media.base44.com/images/public/6907475d81a975154143174e/1d21ce02f_generated_image.png"
                  alt="Green Cut Lawn Care Team"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-[#E8F3ED] px-4 py-2 rounded-full">
                <Leaf className="w-4 h-4 text-[#2E7D5F]" />
                <span className="text-sm font-medium text-[#2E7D5F]">Our Story</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2933]">
                Started to help busy families, investors and NDIS participants
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Green Cut Lawn Care was founded to solve a simple problem: finding reliable, professional outdoor maintenance shouldn't be hard. Too many property owners were frustrated with missed appointments, poor communication, and inconsistent quality.
                </p>
                <p>
                  We built Green Cut differently. We use scheduling systems that send reminders. We take notes about your property preferences. We show up when we say we will. And we stand behind our work with full insurance and professional equipment.
                </p>
                <p>
                  Today, we work with busy families, property investors, real estate agents, body corporate managers, and NDIS support coordinators across the Gold Coast, Logan, and South Brisbane. Every property gets the same attention to detail, whether it's a weekly mow or a full property restoration.
                </p>
                <p className="font-medium text-[#2E7D5F]">
                  We're not the cheapest option - but we're the one you can count on.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2933] mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We operate with transparency, consistency, and genuine care for your property.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#2E7D5F] to-[#236B4F] rounded-2xl flex items-center justify-center mb-4">
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1F2933] mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#E8F3ED] px-4 py-2 rounded-full mb-4">
              <MapPin className="w-4 h-4 text-[#2E7D5F]" />
              <span className="text-sm font-medium text-[#2E7D5F]">Where We Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2933] mb-4">
              Servicing SE Queensland
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We mostly work across the southern Brisbane corridor and the Gold Coast.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(serviceAreas).map(([region, suburbs], index) => (
              <motion.div
                key={region}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#1F2933] mb-4 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-[#2E7D5F]" />
                      {region}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {suburbs.map((suburb) => (
                        <span
                          key={suburb}
                          className="px-3 py-1 bg-[#E8F3ED] text-[#2E7D5F] rounded-full text-sm font-medium"
                        >
                          {suburb}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="inline-block bg-gradient-to-br from-[#E8F3ED] to-white border-2 border-[#2E7D5F]/20">
              <CardContent className="p-6">
                <p className="text-lg text-gray-700">
                  Need us somewhere else?{" "}
                  <Link to={createPageUrl("Contact")} className="text-[#2E7D5F] font-semibold hover:underline">
                    Ask us
                  </Link>
                  {" "}– we may be able to help.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2E7D5F]/90 to-[#236B4F]/90 backdrop-blur-md text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to work with a team you can trust?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join hundreds of satisfied property owners across SE Queensland.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" className="bg-white text-[#2E7D5F] hover:bg-gray-100 shadow-xl text-lg px-8">
                  Get Your Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Services")}>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                  View Our Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}