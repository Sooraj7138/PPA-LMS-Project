export default function DemandStatusSection({ lesseeRows, landRows , demandRows, formatDateOnly }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">View Status of Demand Note</h3>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Consumer Name</th>
                <th className="px-6 py-4">Land Type</th>
                <th className="px-6 py-4">Land Name</th>
                <th className="px-6 py-4 text-center">Due Date</th>
                <th className="px-6 py-4 text-center">Status of Demand Note</th>
                <th className="px-6 py-4 text-right">Status of Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demandRows.map((demandRow, idx) => {
                const landRow = landRows[idx];
                const lesseeRow = lesseeRows[idx];
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0b1f3b]">{lesseeRow?.LesseeName || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{lesseeRow?.LandType || landRow?.LandType || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{lesseeRow?.LandName || landRow?.LandName || "-"}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium">{formatDateOnly(lesseeRow?.LeaseEndDate)}</td>
                    <td className="px-6 py-4 text-center">
                      {demandRow.DemandStatus === "Pending" ? (
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
                          lesseeRow.PaymentStatusCode === "PAID"
                            ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20"
                            : lesseeRow.PaymentStatusCode === "DUE" || lesseeRow.PaymentStatusCode === "BOTH DUE" || lesseeRow.PaymentStatusCode === "ALL DUE"
                            ? "bg-red-100 text-red-700 ring-red-600/20"
                            : "bg-amber-100 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        {lesseeRow.PaymentStatusCode}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
