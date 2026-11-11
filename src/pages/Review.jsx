import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Review() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("job") || "";
  const clientName = urlParams.get("name") || "";
  const service = urlParams.get("service") || "";

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) return;
    setSubmitting(true);
    await base44.entities.Review.create({
      job_id: jobId,
      client_name: clientName,
      service,
      rating,
      comment,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-white/90 backdrop-blur-md shadow-xl">
            <CardContent className="p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-[#2E7D5F] mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-[#1F2933] mb-2">Thank you!</h1>
                  <p className="text-gray-600">
                    Your feedback means a lot to us{clientName ? `, ${clientName.split(" ")[0]}` : ""}.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1F2933] mb-2">How did we do?</h1>
                    <p className="text-gray-600">
                      {service
                        ? `Rate your recent ${service} with FreshCut Property Services.`
                        : "Rate your recent service with FreshCut Property Services."}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="p-1 transition-transform hover:scale-110"
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= (hovered || rating)
                              ? "fill-[#F5A623] text-[#F5A623]"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <Textarea
                    placeholder="Tell us more (optional)…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-6 min-h-24"
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={rating < 1 || submitting}
                    className="w-full bg-[#2E7D5F] hover:bg-[#236B4F] text-white text-lg py-6"
                  >
                    {submitting ? "Submitting…" : "Submit Rating"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}