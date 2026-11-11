import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      before: "https://media.base44.com/images/public/6907475d81a975154143174e/5c0e0a134_generated_image.png",
      after: "https://media.base44.com/images/public/6907475d81a975154143174e/e45da878a_generated_image.png",
      label: "Overgrown → Restored",
      category: "Lawn Care"
    },
    {
      id: 2,
      before: "https://media.base44.com/images/public/6907475d81a975154143174e/56fd4e72a_generated_image.png",
      after: "https://media.base44.com/images/public/6907475d81a975154143174e/a73684544_generated_image.png",
      label: "Mouldy Driveway → Clean",
      category: "Pressure Washing"
    },
    {
      id: 3,
      before: "https://media.base44.com/images/public/6907475d81a975154143174e/300b8254e_generated_image.png",
      after: "https://media.base44.com/images/public/6907475d81a975154143174e/617a8c313_generated_image.png",
      label: "Neglected Garden → Tidy",
      category: "Garden Tidy"
    },
    {
      id: 4,
      before: "https://media.base44.com/images/public/6907475d81a975154143174e/0aa10b0ba_generated_image.png",
      after: "https://media.base44.com/images/public/6907475d81a975154143174e/332d94d58_generated_image.png",
      label: "Long Grass → Manicured",
      category: "Lawn Mowing"
    },
    {
      id: 5,
      before: "https://media.base44.com/images/public/6907475d81a975154143174e/43fc99952_generated_image.png",
      after: "https://media.base44.com/images/public/6907475d81a975154143174e/a3311a110_generated_image.png",
      label: "Storm Cleanup → Safe Access",
      category: "Green Waste"
    },
    {
      id: 6,
      before: "https://media.base44.com/images/public/6907475d81a975154143174e/b794fcee2_generated_image.png",
      after: "https://media.base44.com/images/public/6907475d81a975154143174e/38567b80b_generated_image.png",
      label: "Overgrown Hedge → Shaped",
      category: "Hedge Trimming"
    }
  ];

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
              Before & After Gallery
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              See the transformation. Real results from real properties across SE Queensland.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 group"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative">
                    {/* Before/After Split View */}
                    <div className="relative h-80 overflow-hidden">
                      <div className="absolute inset-0 flex">
                        {/* Before */}
                        <div className="w-1/2 relative overflow-hidden">
                          <img
                            src={item.before}
                            alt="Before"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Before
                          </div>
                        </div>
                        {/* After */}
                        <div className="w-1/2 relative overflow-hidden">
                          <img
                            src={item.after}
                            alt="After"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute top-4 right-4 bg-[#2E7D5F] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            After
                          </div>
                        </div>
                      </div>
                      {/* Divider Line */}
                      <div className="absolute inset-y-0 left-1/2 w-1 bg-white shadow-lg transform -translate-x-1/2 z-10"></div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                          Click to View Full
                        </div>
                      </div>
                    </div>
                    
                    {/* Label */}
                    <div className="p-6 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#1F2933] mb-1">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#E8F3ED] flex items-center justify-center group-hover:bg-[#2E7D5F] transition-colors duration-300">
                          <ArrowRight className="w-5 h-5 text-[#2E7D5F] group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2933] mb-6">
              Want your place to look like this?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let us transform your outdoor space. Get a free quote and see the FreshCut difference.
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white shadow-lg text-lg px-8">
                Get Your Free Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-6xl p-0">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
                
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Before */}
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-medium shadow-lg">
                      Before
                    </div>
                    <img
                      src={selectedImage.before}
                      alt="Before"
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                  
                  {/* After */}
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10 bg-[#2E7D5F] text-white px-4 py-2 rounded-full font-medium shadow-lg">
                      After
                    </div>
                    <img
                      src={selectedImage.after}
                      alt="After"
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                </div>
                
                <div className="p-6 bg-white border-t">
                  <h3 className="text-2xl font-bold text-[#1F2933] mb-2">
                    {selectedImage.label}
                  </h3>
                  <p className="text-gray-600">{selectedImage.category}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}