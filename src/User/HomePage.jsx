export default function HomePage({ paymentRows, formatDateOnly }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">Land Payment Details</h3>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Land Type</th>
                <th className="px-6 py-4">Land Name</th>
                <th className="px-6 py-4">Demand Note</th>
                <th className="px-6 py-4 text-center">Outstanding Due</th>
                <th className="px-6 py-4 text-center">Last Date to Pay</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentRows.map((paymentRow, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{paymentRow?.LandType || "-"}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{paymentRow?.LandName || "-"}</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <img src="https://api.iconify.design/lucide-file-down.svg?color=%231d4ed8" alt="" className="mr-1.5 h-4 w-4" />
                      Download
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 font-medium">{paymentRow?.OutstandingDue || "-"}</td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{formatDateOnly(paymentRow?.LeaseEndDate)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                    >
                      <img src="https://api.iconify.design/lucide-credit-card.svg?color=white" alt="" className="mr-1.5 h-4 w-4" />
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
