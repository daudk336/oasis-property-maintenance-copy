import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientForm from "@/components/admin/ClientForm";
import { Plus, Pencil, Trash2, Phone, Mail, Search } from "lucide-react";

export default function AdminClients() {
  const [clients, setClients] = useState(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    base44.entities.Client.list("-created_date", 500).then(setClients);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (data) => {
    if (editing) {
      await base44.entities.Client.update(editing.id, data);
    } else {
      await base44.entities.Client.create(data);
    }
    setDialogOpen(false);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await base44.entities.Client.delete(id);
    load();
  };

  if (!clients) {
    return <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin mx-auto mt-20" />;
  }

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.suburb?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2933]">Clients</h1>
          <p className="text-sm text-gray-500">{clients.length} clients</p>
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
          <Plus className="w-4 h-4 mr-1" /> Add Client
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <Input placeholder="Search by name, suburb or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          {clients.length === 0 ? "No clients yet — add your first client." : "No clients match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-[#1F2933]">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.suburb}{c.yard_size ? ` · ${c.yard_size}m² yard` : ""}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(c); setDialogOpen(true); }}>
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(c.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-[#2E7D5F]">
                  <Phone className="w-3.5 h-3.5" /> {c.phone}
                </a>
                {c.email && (
                  <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3.5 h-3.5" /> {c.email}
                  </a>
                )}
              </div>
              {c.notes && <p className="text-xs text-gray-400 mt-3 border-t border-gray-50 pt-2">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Client" : "Add Client"}</DialogTitle>
          </DialogHeader>
          <ClientForm client={editing} onSubmit={handleSubmit} onCancel={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}