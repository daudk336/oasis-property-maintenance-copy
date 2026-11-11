import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import InvoiceSummaryCard from "@/components/pay/InvoiceSummaryCard";

export default function PayInvoice() {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get("invoice");
  const justPaid = urlParams.get("paid") === "1";

  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!invoiceId) {
      setError("No invoice specified.");
      return;
    }
    base44.functions
      .invoke("invoicePayment", { invoice_id: invoiceId })
      .then((res) => setInvoice(res.data.invoice))
      .catch(() => setError("We couldn't find this invoice. Please check your link."));
  }, [invoiceId]);

  const handlePay = async () => {
    if (window.self !== window.top) {
      alert("Payments only work from the published app. Please open this page in a new tab.");
      return;
    }
    setPaying(true);
    const res = await base44.functions.invoke("invoicePayment", {
      invoice_id: invoiceId,
      action: "checkout",
      origin: window.location.origin,
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError(res.data?.error || "Could not start checkout. Please try again.");
      setPaying(false);
    }
  };

  const isPaid = justPaid || invoice?.status === "paid";

  return (
    <div className="min-h-[70vh] bg-[#F5F1EB]/50 py-12 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1F2933]">
            {isPaid ? "Payment Received" : "Pay Your Invoice"}
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