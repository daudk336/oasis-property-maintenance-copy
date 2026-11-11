import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import InvoiceSummaryCard from "@/components/pay/InvoiceSummaryCard";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function invokeInvoicePayment(payload) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Payment service is not configured for this app.");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/functions/v1/invoicePayment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Invoice request failed.");
  return data;
}

export default function PayInvoice() {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get("invoice");
  const returnedFromCheckout = urlParams.get("paid") === "1";

  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!invoiceId) {
      setError("No invoice specified.");
      return;
    }

    let cancelled = false;
    let timer;
    let attempts = 0;

    const loadInvoice = async () => {
      try {
        const result = await invokeInvoicePayment({ invoice_id: invoiceId });
        if (cancelled) return;
        setInvoice(result.invoice);
        setError(null);

        if (returnedFromCheckout && result.invoice?.status !== "paid" && attempts < 15) {
          attempts += 1;
          timer = window.setTimeout(loadInvoice, 2000);
        } else if (returnedFromCheckout && result.invoice?.status === "paid") {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("paid");
          window.history.replaceState({}, "", cleanUrl);
        }
      } catch {
        if (!cancelled) setError("We couldn't find this invoice. Please check your link.");
      }
    };

    loadInvoice();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [invoiceId, returnedFromCheckout]);

  const handlePay = async () => {
    if (window.self !== window.top) {
      alert("Payments only work from the published app. Please open this page in a new tab.");
      return;
    }

    setPaying(true);
    setError(null);
    try {
      const result = await invokeInvoicePayment({ invoice_id: invoiceId, action: "checkout" });
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      throw new Error("Could not start checkout. Please try again.");
    } catch (err) {
      setError(err.message || "Could not start checkout. Please try again.");
      setPaying(false);
    }
  };

  const isPaid = invoice?.status === "paid";
  const paymentPending = returnedFromCheckout && !isPaid;

  return (
    <div className="min-h-[70vh] bg-[#F5F1EB]/50 py-12 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1F2933]">
            {isPaid ? "Payment Received" : paymentPending ? "Confirming Payment" : "Pay Your Invoice"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">FreshCut Property Services</p>
        </div>

        {error && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">{error}</div>
        )}

        {!error && !invoice && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#2E7D5F] animate-spin" />
          </div>
        )}

        {invoice && (
          <>
            <InvoiceSummaryCard invoice={invoice} />
            {isPaid ? (
              <div className="bg-[#E8F3ED] rounded-2xl p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#2E7D5F] mx-auto mb-2" />
                <p className="font-semibold text-[#2E7D5F]">This invoice has been paid. Thank you!</p>
              </div>
            ) : paymentPending ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-600">
                <Loader2 className="w-7 h-7 text-[#2E7D5F] animate-spin mx-auto mb-2" />
                <p className="font-medium">We are confirming your payment with Stripe.</p>
                <p className="text-sm mt-1">This page will update automatically when confirmation arrives.</p>
              </div>
            ) : (
              <Button
                onClick={handlePay}
                disabled={paying}
                className="w-full h-12 text-base bg-[#2E7D5F] hover:bg-[#236B4F] text-white shadow-md"
              >
                {paying ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-5 h-5 mr-2" />
                )}
                {paying ? "Redirecting to secure checkout..." : `Pay $${(invoice.total || 0).toFixed(2)} Securely`}
              </Button>
            )}
            <p className="text-xs text-center text-gray-400">Payments are processed securely by Stripe.</p>
          </>
        )}
      </div>
    </div>
  );
}
