import React from "react";

export default function InvoiceSummaryCard({ invoice }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">Invoice</p>
          <p className="text-xl font-bold text-[#1F2933]">{invoice.invoice_number}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Billed to</p>
          <p className="font-semibold text-[#1F2933]">{invoice.client_name}</p>
          {invoice.due_date && <p className="text-xs text-gray-400">Due {invoice.due_date}</p>}
        </div>
      </div>

      <div className="divide-y divide-gray-100 border-t border-gray-100">
        {(invoice.items || []).map((item, idx) => (
          <div key={idx} className="flex justify-between py-3 text-sm">
            <span className="text-gray-600">
              {item.description}{item.quantity > 1 ? ` × ${item.quantity}` : ""}
            </span>
            <span className="font-medium text-[#1F2933]">
              ${((item.quantity || 1) * (item.price || 0)).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="font-semibold text-[#1F2933]">Total</span>
        <span className="text-2xl font-bold text-[#2E7D5F]">${(invoice.total || 0).toFixed(2)}</span>
      </div>

      {invoice.notes && <p className="text-xs text-gray-400">{invoice.notes}</p>}
    </div>
  );
}