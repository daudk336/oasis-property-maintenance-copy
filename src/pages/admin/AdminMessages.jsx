import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Send, Info } from "lucide-react";
import { format } from "date-fns";

export default function AdminMessages() {
  const [messages, setMessages] = useState(null);
  const [clients, setClients] = useState([]);
  const [channel, setChannel] = useState("email");
  const [clientName, setClientName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    base44.entities.Message.list("-created_date", 100).then(setMessages);
    base44.entities.Client.list("name", 500).then(setClients);
  }, []);

  useEffect(() => { load(); }, [load]);

  const pickClient = (name) => {
    const c = clients.find((cl) => cl.name === name);
    setClientName(name);
    setRecipient(channel === "email" ? c?.email || "" : c?.phone || "");
  };

  const handleChannel = (ch) => {
    setChannel(ch);
    const c = clients.find((cl) => cl.name === clientName);
    if (c) setRecipient(ch === "email" ? c.email || "" : c.phone || "");
  };

  const send = async (e) => {
    e.preventDefault();
    setSending(true);
    let status = "logged";
    if (channel === "email") {
      await base44.integrations.Core.SendEmail({
        to: recipient,
        subject: subject || "Message from Oasis Property Maintenance",
        body,
        from_name: "Oasis Property Maintenance",
      });
      status = "sent";
    }
    await base44.entities.Message.create({
      client_name: clientName || undefined,
      channel,
      recipient,
      subject: channel === "email" ? subject : undefined,
      body,
      status,
    });
    setSubject("");
    setBody("");
    setSending(false);
    load();
  };

  if (!messages) {
    return <div className="w-8 h-8 border-4 border-[#E8F3ED] border-t-[#2E7D5F] rounded-full animate-spin mx-auto mt-20" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F2933]">Messages</h1>
        <p className="text-sm text-gray-500">Send emails and log SMS to your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <form onSubmit={send} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
          <h2 className="font-bold text-[#1F2933]">New message</h2>
          <div className="flex gap-2">
            {["email", "sms"].map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => handleChannel(ch)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  channel === ch ? "border-[#2E7D5F] bg-[#E8F3ED] text-[#2E7D5F]" : "border-gray-200 text-gray-600"
                }`}
              >
                {ch === "email" ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                {ch.toUpperCase()}
              </button>
            ))}
          </div>

          {channel === "sms" && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              SMS messages are logged here for your records. Connect a Twilio account to send them automatically — ask me to set it up.
            </div>
          )}

          {clients.length > 0 && (
            <div>
              <Label>Client</Label>
              <Select value={clientName} onValueChange={pickClient}>
                <SelectTrigger><SelectValue placeholder="Select a client (optional)" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>{channel === "email" ? "Email address *" : "Phone number *"}</Label>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
          </div>

          {channel === "email" && (
            <div>
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
          )}

          <div>
            <Label>Message *</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} required />
          </div>

          <Button type="submit" disabled={sending} className="w-full bg-[#2E7D5F] hover:bg-[#236B4F] text-white">
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Sending..." : channel === "email" ? "Send Email" : "Log SMS"}
          </Button>
        </form>

        {/* History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#1F2933] mb-4">History</h2>
          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No messages yet</p>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-y-auto">
              {messages.map((m) => (
                <div key={m.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {m.channel === "email" ? (
                      <Mail className="w-3.5 h-3.5 text-[#2E7D5F]" />
                    ) : (
                      <MessageSquare className="w-3.5 h-3.5 text-[#2E7D5F]" />
                    )}
                    <p className="text-sm font-semibold text-[#1F2933]">{m.client_name || m.recipient}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      m.status === "sent" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {m.status}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {m.created_date && format(new Date(m.created_date), "d MMM, h:mma")}
                    </span>
                  </div>
                  {m.subject && <p className="text-xs font-medium text-gray-600 mt-1">{m.subject}</p>}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-3">{m.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}