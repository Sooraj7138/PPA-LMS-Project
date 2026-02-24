export default function HomePage({ paymentRows }) {
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
                  <td className="px-6 py-4 font-bold text-[#0b1f3b]">{paymentRow?.name}</td>
                  <td className="px-6 py-4 text-slate-600">{row.type}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{row.land}</td>
                  <td className="px-6 py-4 text-center text-slate-500 font-medium">{row.date}</td>
                  <td className="px-6 py-4 text-center">
                    {row.status === "Action Needed" ? (
                      <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm">
                        Send for Recheck
                      </button>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold ring-1 ring-inset ring-green-600/20">
                        Approved
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                        row.payment === "Paid"
                          ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20"
                          : row.payment === "Not Paid"
                          ? "bg-red-100 text-red-700 ring-red-600/20"
                          : "bg-slate-100 text-slate-700 ring-slate-600/20"
                      }`}
                    >
                      {row.payment}
                    </span>
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