import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ClientForm({ client, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    suburb: client?.suburb || "",
    yard_size: client?.yard_size || "",
    notes: client?.notes || "",
    status: client?.status || "active",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({ ...form, yard_size: form.yard_size ? Number(form.yard_size) : undefined });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input value={form.name} onChange={set("name")} required />
        </div>
        <div>
          <Label>Phone *</Label>
          <Input value={form.phone} onChange={set("phone")} required />
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={form.email} onChange={set("email")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Address</Label>
          <Input value={form.address} onChange={set("address")} />
        </div>
        <div>
          <Label>Suburb</Label>
          <Input value={form.suburb} onChange={set("suburb")} />
        </div>
      </div>
      <div>
        <Label>Yard size (m²)</Label>
        <Input type="number" value={form.yard_size} onChange={set("yard_size")} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={set("notes")} rows={3} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
          {saving ? "Saving..." : client ? "Update Client" : "Add Client"}
        </Button>
      </div>
    </form>
  );
}