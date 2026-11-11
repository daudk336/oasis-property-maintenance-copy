import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JobForm from "@/components/admin/JobForm";
import { Plus, Trash2, MapPin, Receipt } from "lucide-react";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import useWeather from "@/components/weather/useWeather";
import WeatherBadge from "@/components/weather/WeatherBadge";

const STATUS_COLORS = {
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function dateLabel(dateStr) {
  const d = parseISO(dateStr);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "EEEE d MMMM");
}

export default function AdminSchedule() {
  const [jobs, setJobs] = useState(null);
  const [clients, setClients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [invoicingId, setInvoicingId] = useState(null);
  const weather = useWeather();

  const load = useCallback(() => {
    base44.entities.Job.list("date", 500).then(setJobs);
    base44.entities.Client.list("name", 500).then(setClients);
    base44.entities.Invoice.list("-created_date", 500).then(setInvoices);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data) => {
    await base44.entities.Job.create({ ...data, status: "scheduled" });
    setDialogOpen(false);
    load();
  };

  const updateStatus = async (id, status) => {
    await base44.entities.Job.update(id, { status });
    load();
  };

  const remove = async (id) => {
    await base44.entities.Job.delete(id);
    load();
  };

  const invoicedJobIds = new Set(invoices.map((i) => i.job_id).filter(Boolean));

  const createInvoiceFromJob = async (job) => {
    setInvoicingId(job.id);
    const client = clients.find((c) => c.name === job.client_name);
    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    await base44.entities.Invoice.create({
      invoice_number: `INV-${String(invoices.length + 1).padStart(4, "0")}`,
      client_name: job.client_name,
      client_email: client?.email || "",
      job_id: job.id,
      items: [{ description: `${job.service} — ${job.date}`, quantity: 1, price: job.price || 0 }],
      total: job.price || 0,
      issue_date: issueDate.toISOString().split("T")[0],
      due_date: dueDate.toISOString().split("T")[0],
      status: "draft",
    });
    setInvoicingId(null);
    load();
  };

  if (!jobs) {
    return <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin mx-auto mt-20" />;
  }

  const grouped = jobs.reduce((acc, job) => {
    (acc[job.date] = acc[job.date] || []).push(job);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2933]">Schedule</h1>
          <p className="text-sm text-gray-500">{jobs.filter((j) => j.status === "scheduled").length} jobs scheduled</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
          <Plus className="w-4 h-4 mr-1" /> Schedule Job
        </Button>
      </div>

      {dates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          No jobs scheduled — add your first job or convert a booking.
        </div>
      ) : (
        <div className="space-y-8">
          {dates.map((date) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-bold text-[#2E7D5F] uppercase tracking-wider">{dateLabel(date)}</h2>
                {weather && weather[date] && <WeatherBadge day={weather[date]} compact />}
              </div>
              <div className="space-y-3">
                {grouped[date].map((j) => (
                  <div key={j.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-bold text-[#1F2933]">{j.client_name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[j.status] || ""}`}>
                          {j.status.replace("_", " ")}
                        </span>
                        {j.price ? <span className="text-xs font-bold text-[#2E7D5F]">${j.price}</span> : null}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {j.service}{j.time_slot ? ` · ${j.time_slot}` : ""}
                      </p>
                      {(j.address || j.suburb) && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <MapPin className="w-3 h-3" /> {[j.address, j.suburb].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {j.status === "completed" && (
                        invoicedJobIds.has(j.id) ? (
                          <span className="text-xs font-semibold text-[#2E7D5F] bg-[#E8F3ED] px-2 py-1 rounded-full">Invoiced</span>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={invoicingId === j.id}
                            onClick={() => createInvoiceFromJob(j)}
                          >
                            <Receipt className="w-3.5 h-3.5 mr-1" />
                            {invoicingId === j.id ? "Creating..." : "Invoice"}
                          </Button>
                        )
                      )}
                      <Select value={j.status} onValueChange={(v) => updateStatus(j.id, v)}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.keys(STATUS_COLORS).map((s) => (
                            <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => remove(j.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule a Job</DialogTitle>
          </DialogHeader>
          <JobForm clients={clients} onSubmit={handleSubmit} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}