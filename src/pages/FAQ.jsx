import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      category: "Pricing & Quotes",
      questions: [
        {
          question: "How much is lawn mowing?",
          answer: "Most small residential lawns start from $45-$65 depending on access, slope, and green waste removal. Block size, terrain, and whether clippings need to be removed all affect the price. We provide free quotes so you know exactly what to expect."
        },
        {
          question: "How do you calculate the price?",
          answer: "We consider several factors: property size, access (gates, stairs, slopes), current condition, frequency of service, and whether you want clippings removed. Regular customers often get better rates than one-off visits."
        },
        {
          question: "Do you charge extra for green waste removal?",
          answer: "It depends on the service. For lawn mowing, we can include clippings removal or mulch them on-site. For larger jobs like garden tidy-ups or storm cleanup, green waste removal is usually quoted separately based on volume."
        },
        {
          question: "Can I get a quote without a site visit?",
          answer: "For most standard residential properties, we can provide an accurate quote from photos and your address (we use satellite view to check size). For larger or complex properties, we prefer a quick site visit to give you the best price."
        }
      ]
    },
    {
      category: "Services & Scheduling",
      questions: [
        {
          question: "Do you take the clippings?",
          answer: "Yes, clippings removal can be included in your service. We can either take them away, or mulch them back into the lawn (which is better for the lawn health). Just let us know your preference."
        },
        {
          question: "Can I book regular visits?",
          answer: "Absolutely! We offer weekly, fortnightly, or every 4 weeks scheduling. Regular customers get priority booking and often better rates. We send reminders before each visit and keep notes about your property preferences."
        },
        {
          question: "What if I need a one-off service?",
          answer: "No problem. We do plenty of one-off jobs - end of lease tidy-ups, pre-sale cleanups, storm damage, or just catching up on an overgrown property. One-off pricing is slightly higher than regular service rates."
        },
        {
          question: "Do you work in the rain?",
          answer: "We avoid mowing in heavy rain as it damages lawns and creates a mess. If weather prevents your scheduled service, we'll reschedule at no extra charge. For other services like gutter cleaning or pressure washing, light rain is usually fine."
        },
        {
          question: "How do I reschedule or cancel?",
          answer: "Just call or text us. We ask for 24 hours notice if possible. For regular customers on a schedule, we're flexible and will work around your needs."
        }
      ]
    },
    {
      category: "Property Access & Safety",
      questions: [
        {
          question: "Do I need to be home?",
          answer: "No, as long as we can access your property. Many of our regular customers provide gate codes or leave gates unlocked on service days. We'll send a message when we're done and can leave before/after photos."
        },
        {
          question: "What about my pets?",
          answer: "We love pets! Just let us know if you have dogs. If they're friendly and secured, we can work around them. If they're protective, we might need you home or for them to be inside during the service."
        },
        {
          question: "Are you insured?",
          answer: "Yes – we carry public liability insurance. We can provide a copy of our certificate if needed (common for body corporate or NDIS work). We also take photos before starting work for record-keeping."
        },
        {
          question: "What if something gets damaged?",
          answer: "We take care to avoid damage, but if something does happen, we'll let you know immediately and work with you to fix it. That's what our insurance is for."
        }
      ]
    },
    {
      category: "Specific Services",
      questions: [
        {
          question: "Can you clean single-storey gutters?",
          answer: "Yes, we handle single-storey gutter cleaning. We clear out leaves and debris, flush downpipes, and provide photos of the work done. Perfect before storm season (October-March in SE QLD)."
        },
        {
          question: "Do you do two-storey houses?",
          answer: "For most services yes, but for gutter cleaning we currently only service single-storey properties. For two-storey gutters, we can recommend a specialist."
        },
        {
          question: "What pressure washing surfaces can you clean?",
          answer: "Driveways, paths, patios, pool surrounds, tennis courts, and most outdoor hard surfaces. We use appropriate pressure for the surface – high pressure for concrete, gentler pressure for pavers and delicate surfaces."
        },
        {
          question: "Can you trim high hedges?",
          answer: "We can trim hedges up to about 2.5-3 metres. For very tall hedges or those requiring specialist equipment, we may need to bring in additional help or refer you to a specialist arborist."
        },
        {
          question: "Do you work with NDIS participants?",
          answer: "Yes, we work with support coordinators to maintain safe, accessible outdoor spaces for NDIS participants. We understand the importance of clear pathways, safe access, and consistent quality for support homes."
        }
      ]
    },
    {
      category: "Payment & Admin",
      questions: [
        {
          question: "When do I pay?",
          answer: "We typically invoice after the service is completed. Regular customers can set up direct debit or pay by invoice. We accept bank transfer, cash, or card payment."
        },
        {
          question: "Do you provide receipts and invoices?",
          answer: "Yes, all work is invoiced properly with ABN. Perfect for rental property owners, body corporate, or anyone who needs documentation for tax or records."
        },
        {
          question: "Can you invoice my property manager?",
          answer: "Absolutely. We work with many property managers and real estate agents. Just provide their details and we'll send invoices directly to them."
        }
      ]
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
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">We've Got Answers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Everything you need to know about our services, pricing, and how we work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqs.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-[#2E7D5F] to-[#236B4F] px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">
                      {category.category}
                    </h2>
                  </div>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} className="border-b last:border-0">
                          <AccordionTrigger className="px-6 py-4 text-left hover:bg-[#E8F3ED]/30 transition-colors">
                            <span className="font-semibold text-[#1F2933] pr-4">
                              {faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-[#2E7D5F]/20 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2E7D5F] to-[#236B4F] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#1F2933] mb-4">
                Still have questions?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We're here to help. Give us a call or send through your question and we'll get back to you quickly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+61400000000">
                  <Button size="lg" className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white shadow-lg text-lg px-8">
                    Call Us: 0400 000 000
                  </Button>
                </a>
                <Link to={createPageUrl("Contact")}>
                  <Button size="lg" variant="outline" className="border-2 border-[#2E7D5F] text-[#2E7D5F] hover:bg-[#E8F3ED] text-lg px-8">
                    Send a Message
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1F2933] mb-4">
              Quick Tips for Getting Started
            </h2>
            <p className="text-gray-600">
              Make your first service as smooth as possible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2E7D5F] rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl">
                  1
                </div>
                <h3 className="font-bold text-[#1F2933] mb-2">Take Photos</h3>
                <p className="text-sm text-gray-600">
                  Send us photos of your property from different angles. It helps us quote accurately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2E7D5F] rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl">
                  2
                </div>
                <h3 className="font-bold text-[#1F2933] mb-2">Mention Access</h3>
                <p className="text-sm text-gray-600">
                  Let us know about gates, locks, pets, or any access considerations upfront.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#2E7D5F] rounded-xl flex items-center justify-center mb-4 text-white font-bold text-xl">
                  3
                </div>
                <h3 className="font-bold text-[#1F2933] mb-2">Tell Us Your Preference</h3>
                <p className="text-sm text-gray-600">
                  Do you want clippings removed? Short or slightly longer? Any areas to avoid? Just let us know.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}