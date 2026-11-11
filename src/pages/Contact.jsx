import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Leaf
} from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    services: [],
    service_type: "one_off",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = [
    "Lawn mowing & edging",
    "Whipper snipping",
    "Garden tidy-up",
    "Hedge trimming",
    "Mulch top-up",
    "Pressure washing",
    "Gutter cleaning",
    "Green waste removal",
    "Bond/rental tidy",
    "Handyman tasks",
    "Strata maintenance",
    "Other"
  ];

  const suburbs = [
    "Parkwood", "Arundel", "Helensvale", "Coomera", "Pimpama", "Southport", "Robina",
    "Shailer Park", "Daisy Hill", "Springwood", "Beenleigh", "Loganholme", "Underwood",
    "Eight Mile Plains", "Sunnybank", "Calamvale", "Stretton", "Kuraby", "Other"
  ];

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.Quote.create(formData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        suburb: "",
        services: [],
        service_type: "one_off",
        message: ""
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("There was an error submitting your quote. Please try calling us instead.");
    } finally {
      setIsSubmitting(false);
    }
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
              Get Your Free Quote
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Tell us what you need, and we'll get back to you with a free, no-obligation quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-xl text-[#1F2933] mb-4 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-[#2E7D5F]" />
                      Contact Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="tel:+61400000000"
                      className="flex items-start gap-3 p-4 rounded-xl hover:bg-[#E8F3ED] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#2E7D5F] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Call us</div>
                        <div className="font-semibold text-[#1F2933]">0400 000 000</div>
                      </div>
                    </a>

                    <a
                      href="mailto:info@greencutlawncare.com.au"
                      className="flex items-start gap-3 p-4 rounded-xl hover:bg-[#E8F3ED] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#2E7D5F] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email us</div>
                        <div className="font-semibold text-[#1F2933] break-all">info@greencutlawncare.com.au</div>
                      </div>
                    </a>

                    <div className="flex items-start gap-3 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-[#2E7D5F] rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Service areas</div>
                        <div className="font-semibold text-[#1F2933]">Gold Coast, Logan, South Brisbane</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-[#2E7D5F] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Response time</div>
                        <div className="font-semibold text-[#1F2933]">Usually within 24 hours</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-[#E8F3ED] to-white border-2 border-[#2E7D5F]/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-[#1F2933] mb-3">
                    Quick Response Guarantee
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    We aim to respond to all quote requests within 24 hours, usually much faster. For urgent jobs, give us a call directly.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#2E7D5F] font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Emergency/storm clean-up available</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quote Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-[#2E7D5F] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-[#1F2933] mb-4">
                        Thanks! We've got your quote request.
                      </h2>
                      <p className="text-lg text-gray-600 mb-8">
                        Green Cut will text or call you to confirm the job. We usually respond within a few hours.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-[#2E7D5F] hover:bg-[#236B4F]"
                      >
                        Submit Another Quote
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-[#1F2933] mb-2">
                          Request a Quote
                        </h2>
                        <p className="text-gray-600">
                          Fill out the form below and we'll get back to you with pricing.
                        </p>
                      </div>

                      {/* Personal Details */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Smith"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="0400 000 000"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="suburb">Suburb *</Label>
                          <Select
                            required
                            value={formData.suburb}
                            onValueChange={(value) => setFormData({...formData, suburb: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your suburb" />
                            </SelectTrigger>
                            <SelectContent>
                              {suburbs.map((suburb) => (
                                <SelectItem key={suburb} value={suburb}>
                                  {suburb}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="space-y-3">
                        <Label>What do you need? * (select all that apply)</Label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {serviceOptions.map((service) => (
                            <div key={service} className="flex items-center space-x-2">
                              <Checkbox
                                id={service}
                                checked={formData.services.includes(service)}
                                onCheckedChange={() => handleServiceToggle(service)}
                              />
                              <label
                                htmlFor={service}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {service}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Service Type */}
                      <div className="space-y-3">
                        <Label>Service Type *</Label>
                        <RadioGroup
                          value={formData.service_type}
                          onValueChange={(value) => setFormData({...formData, service_type: value})}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="one_off" id="one_off" />
                            <Label htmlFor="one_off" className="cursor-pointer">
                              One-off job
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ongoing" id="ongoing" />
                            <Label htmlFor="ongoing" className="cursor-pointer">
                              Ongoing/regular service
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Additional Details</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          placeholder="Tell us more about your property, any specific requirements, best time to call you, etc."
                          rows={4}
                        />
                        <p className="text-xs text-gray-500">
                          Tip: Mention property size, access details, current condition, and any specific preferences.
                        </p>
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting || formData.services.length === 0}
                        className="w-full bg-[#2E7D5F] hover:bg-[#236B4F] text-white text-lg"
                      >
                        {isSubmitting ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Get My Free Quote
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-center text-gray-500">
                        By submitting this form, you agree to be contacted by Green Cut Lawn Care regarding your quote.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1F2933] mb-4">
              Proudly Servicing SE Queensland
            </h2>
            <p className="text-lg text-gray-600">
              From the Gold Coast to South Brisbane - we've got you covered
            </p>
          </div>

          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200"
              alt="Service area map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Gold Coast · Logan · South Brisbane</h3>
                <p className="text-white/90">And surrounding suburbs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}