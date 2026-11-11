import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CheckCircle2, ChevronLeft, ChevronRight, CalendarCheck, Clock, Home as HomeIcon } from "lucide-react";
import EstimateCalculator from "@/components/booking/EstimateCalculator";
import { TIME_SLOTS } from "@/components/booking/estimateData";
import useWeather from "@/components/weather/useWeather";
import WeatherBadge from "@/components/weather/WeatherBadge";

const STEPS = ["Service & Estimate", "Date & Time", "Your Details"];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [estimate, setEstimate] = useState(null);
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [details, setDetails] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    address: "",
    suburb: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const weather = useWeather();
  const selectedWeather = date && weather ? weather[format(date, "yyyy-MM-dd")] : null;

  const set = (key) => (e) => setDetails({ ...details, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Booking.create({
      ...details,
      service: estimate.service,
      booking_date: format(date, "yyyy-MM-dd"),
      time_slot: timeSlot,
      estimated_price: estimate.estimate.mid,
      status: "pending",
    });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-lg w-full text-center"
        >
          <div className="w-16 h-16 bg-[#E8F3ED] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#2E7D5F]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1F2933] mb-3">Booking requested!</h1>
          <p className="text-gray-500 mb-6">
            Thanks {details.customer_name.split(" ")[0]} — we've got your request for{" "}
            <span className="font-semibold text-[#1F2933]">{estimate.service}</span> on{" "}
            <span className="font-semibold text-[#1F2933]">{format(date, "EEEE d MMMM")}</span> ({timeSlot}).
            We'll confirm by phone shortly.
          </p>
          <div className="bg-[#F5F1EB] rounded-xl p-4 mb-6">
            <p className="text-xs uppercase tracking-wider text-gray-500">Estimated price</p>
            <p className="text-2xl font-bold text-[#2E7D5F]">
              ${estimate.estimate.low} – ${estimate.estimate.high}
            </p>
          </div>
          <Link to="/">
            <Button className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">Back to Home</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="bg-white/85 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl p-6 md:p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2933] mb-3">Book a Service</h1>
        <p className="text-gray-500">Pick your service, see your price, choose your date.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((label, idx) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx <= step ? "bg-[#2E7D5F] text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${idx <= step ? "text-[#1F2933]" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && <div className={`w-8 h-0.5 ${idx < step ? "bg-[#2E7D5F]" : "bg-gray-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <EstimateCalculator onChange={setEstimate} />
            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep(1)} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white px-8">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarCheck className="w-5 h-5 text-[#2E7D5F]" />
                    <h3 className="font-bold text-[#1F2933]">Pick a date</h3>
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-xl border"
                  />
                  {date && (
                    <div className="mt-4">
                      {selectedWeather ? (
                        <WeatherBadge day={selectedWeather} />
                      ) : (
                        <p className="text-xs text-gray-400 px-1">
                          Forecast not available yet for this date — we'll keep an eye on it.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-[#2E7D5F]" />
                    <h3 className="font-bold text-[#1F2933]">Pick a time</h3>
                  </div>
                  <div className="space-y-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                          timeSlot === slot
                            ? "border-[#2E7D5F] bg-[#E8F3ED] text-[#2E7D5F]"
                            : "border-gray-200 text-[#1F2933] hover:border-[#2E7D5F]/40"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(2)} disabled={!date || !timeSlot} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white px-8">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <HomeIcon className="w-5 h-5 text-[#2E7D5F]" />
                <h3 className="font-bold text-[#1F2933]">Your details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full name *</Label>
                  <Input value={details.customer_name} onChange={set("customer_name")} required />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input type="tel" value={details.customer_phone} onChange={set("customer_phone")} required />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={details.customer_email} onChange={set("customer_email")} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Street address</Label>
                  <Input value={details.address} onChange={set("address")} />
                </div>
                <div>
                  <Label>Suburb *</Label>
                  <Input value={details.suburb} onChange={set("suburb")} required />
                </div>
              </div>
              <div>
                <Label>Anything we should know?</Label>
                <Textarea value={details.notes} onChange={set("notes")} rows={3} placeholder="Gate codes, pets, problem areas..." />
              </div>

              <div className="bg-[#F5F1EB] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1F2933]">{estimate?.service}</p>
                  <p className="text-xs text-gray-500">
                    {date && format(date, "EEE d MMM")} · {timeSlot} · ~{estimate?.yardSize}m²
                  </p>
                </div>
                <p className="text-lg font-bold text-[#2E7D5F]">
                  ${estimate?.estimate.low}–${estimate?.estimate.high}
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white px-8">
                  {submitting ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}