import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export default function InvoiceForm({ clients = [], nextNumber, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    invoice_number: nextNumber,
    client_name: "",
    client_email: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: "",
    notes: "",
  });
  const [items, setItems] = useState([{ description: "", quantity: 1, price: "" }]);
  const [saving, setSaving] = useState(false);

  const total = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.price) || 0), 0);

  const setItem = (idx, key, value) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
  };

  const pickClient = (name) => {
    const c = clients.find((cl) => cl.name === name);
    setForm({ ...form, client_name: name, client_email: c?.email || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({
      ...form,
      items: items.map((i) => ({ description: i.description, quantity: Number(i.quantity) || 1, price: Number(i.price) || 0 })),
      total,
      status: "draft",
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Invoice #</Label>
          <Input value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} required />
        </div>
        <div>
          <Label>Client *</Label>
          {clients.length > 0 ? (
            <Select value={form.client_name} onValueChange={pickClient}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} required />
          )}
        </div>
      </div>
      <div>
        <Label>Client email</Label>
        <Input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Issue date</Label>
          <Input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
        </div>
        <div>
          <Label>Due date</Label>
          <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
        </div>
      </div>

      <div>
        <Label>Line items</Label>
        <div className="space-y-2 mt-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <Input placeholder="Description" value={item.description} onChange={(e) => setItem(idx, "description", e.target.value)} className="flex-1" required />
              <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => setItem(idx, "quantity", e.target.value)} className="w-16" />
              <Input type="number" placeholder="$" value={item.price} onChange={(e) => setItem(idx, "price", e.target.value)} className="w-24" required />
              {items.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setItems(items.filter((_, i) => i !== idx))}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setItems([...items, { description: "", quantity: 1, price: "" }])}>
          <Plus className="w-4 h-4 mr-1" /> Add item
        </Button>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <p className="text-lg font-bold text-[#1F2933]">Total: ${total.toFixed(2)}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={saving || !form.client_name} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
            {saving ? "Saving..." : "Create Invoice"}
          </Button>
        </div>
      </div>
    </form>
  );
}