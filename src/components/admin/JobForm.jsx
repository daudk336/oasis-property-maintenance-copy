import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ESTIMATE_SERVICES, TIME_SLOTS } from "@/components/booking/estimateData";

export default function JobForm({ job, clients = [], onSubmit, onCancel }) {
  const [form, setForm] = useState({
    client_name: job?.client_name || "",
    client_phone: job?.client_phone || "",
    service: job?.service || "",
    date: job?.date || "",
    time_slot: job?.time_slot || "",
    address: job?.address || "",
    suburb: job?.suburb || "",
    price: job?.price || "",
    notes: job?.notes || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const pickClient = (name) => {
    const c = clients.find((cl) => cl.name === name);
    setForm({
      ...form,
      client_name: name,
      client_phone: c?.phone || form.client_phone,
      address: c?.address || form.address,
      suburb: c?.suburb || form.suburb,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({ ...form, price: form.price ? Number(form.price) : undefined });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Client *</Label>
        {clients.length > 0 ? (
          <Select value={form.client_name} onValueChange={pickClient}>
            <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input value={form.client_name} onChange={set("client_name")} required />
        )}
      </div>
      <div>
        <Label>Service *</Label>
        <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
          <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
          <SelectContent>
            {ESTIMATE_SERVICES.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date *</Label>
          <Input type="date" value={form.date} onChange={set("date")} required />
        </div>
        <div>
          <Label>Time slot</Label>
          <Select value={form.time_slot} onValueChange={(v) => setForm({ ...form, time_slot: v })}>
            <SelectTrigger><SelectValue placeholder="Any time" /></SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Address</Label>
          <Input value={form.address} onChange={set("address")} />
        </div>
        <div>
          <Label>Price ($)</Label>
          <Input type="number" value={form.price} onChange={set("price")} />
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={set("notes")} rows={2} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving || !form.client_name || !form.service || !form.date} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
          {saving ? "Saving..." : job ? "Update Job" : "Schedule Job"}
        </Button>
      </div>
    </form>
  );
}