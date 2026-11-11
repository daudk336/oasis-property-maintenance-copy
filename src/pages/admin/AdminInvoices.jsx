import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InvoiceForm from "@/components/admin/InvoiceForm";
import { Plus, Trash2, Send, Link2, Check } from "lucide-react";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
};

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState(null);
  const [clients, setClients] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const payLink = (inv) => `${window.location.origin}/PayInvoice?invoice=${inv.id}`;

  const copyLink = async (inv) => {
    await navigator.clipboard.writeText(payLink(inv));
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const load = useCallback(() => {
    base44.entities.Invoice.list("-created_date", 500).then(setInvoices);
    base44.entities.Client.list("name", 500).then(setClients);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    await base44.entities.Invoice.create(data);
    setDialogOpen(false);
    load();
  };

  const updateStatus = async (id, status) => {
    await base44.entities.Invoice.update(id, { status });
    load();
  };

  const remove = async (id) => {
    await base44.entities.Invoice.delete(id);
    load();
  };

  const sendInvoice = async (inv) => {
    setSendingId(inv.id);
    const lines = (inv.items || [])
      .map((i) => `- ${i.description} (x${i.quantity}): $${(i.quantity * i.price).toFixed(2)}`)
      .join("\n");
    await base44.integrations.Core.SendEmail({
      to: inv.client_email,
      subject: `Invoice ${inv.invoice_number} from Oasis Property Maintenance`,
      body: `Hi ${inv.client_name},\n\nPlease find your invoice below.\n\nInvoice: ${inv.invoice_number}\nIssued: ${inv.issue_date || "-"}\nDue: ${inv.due_date || "-"}\n\n${lines}\n\nTotal: $${inv.total.toFixed(2)}\n\nPay online securely with card: ${payLink(inv)}\n\n${inv.notes || ""}\n\nThank you,\nOasis Property Maintenance\n0400 000 000`,
      from_name: "Oasis Property Maintenance",
    });
    await base44.entities.Invoice.update(inv.id, { status: "sent" });
    setSendingId(null);
    load();
  };

  if (!invoices) {
    return <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin mx-auto mt-20" />;
  }

  const nextNumber = `INV-${String(invoices.length + 1).padStart(4, "0")}`;
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + (i.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2933]">Invoices</h1>
          <p className="text-sm text-gray-500">${outstanding.toFixed(2)} outstanding</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
          <Plus className="w-4 h-4 mr-1" /> New Invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          No invoices yet — create your first invoice.
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-bold text-[#1F2933]">{inv.invoice_number}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[inv.status] || ""}`}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {inv.client_name}{inv.due_date ? ` · Due ${inv.due_date}` : ""}{inv.paid_date ? ` · Paid ${inv.paid_date}` : ""}
                </p>
                {(inv.items || []).length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {inv.items.map((i) => i.description).join(", ")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#1F2933] mr-2">${(inv.total || 0).toFixed(2)}</span>
                {inv.status !== "paid" && (
                  <Button variant="outline" size="sm" onClick={() => copyLink(inv)}>
                    {copiedId === inv.id ? (
                      <><Check className="w-3.5 h-3.5 mr-1 text-green-600" /> Copied</>
                    ) : (
                      <><Link2 className="w-3.5 h-3.5 mr-1" /> Pay link</>
                    )}
                  </Button>
                )}
                {inv.client_email && inv.status !== "paid" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={sendingId === inv.id}
                    onClick={() => sendInvoice(inv)}
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    {sendingId === inv.id ? "Sending..." : "Email"}
                  </Button>
                )}
                <Select value={inv.status} onValueChange={(v) => updateStatus(inv.id, v)}>
                  <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATUS_COLORS).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => remove(inv.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm clients={clients} nextNumber={nextNumber} onSubmit={handleCreate} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}