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
                const status = demandRow?.DemandStatus || "-";
                const statusUpper = String(status).toUpperCase();
                return (
                  <tr key={demandRow?.DemandNoteID || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0b1f3b]">{demandRow?.name || lesseeRow?.LesseeName || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{demandRow?.type || lesseeRow?.LandType || landRow?.LandType || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{demandRow?.land || lesseeRow?.LandName || landRow?.LandName || "-"}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium">{formatDateOnly(demandRow?.dueDate || lesseeRow?.LeaseEndDate)}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                          statusUpper === "ISSUED"
                            ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20"
                            : statusUpper === "REJECTED"
                            ? "bg-red-100 text-red-700 ring-red-600/20"
                            : statusUpper === "GENERATED"
                            ? "bg-amber-100 text-amber-700 ring-amber-600/20"
                            : "bg-slate-100 text-slate-700 ring-slate-300"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                          (lesseeRow?.PaymentStatusCode || "").toUpperCase() === "PAID"
                            ? "bg-emerald-100 text-emerald-700 ring-emerald-600/20"
                            : (lesseeRow?.PaymentStatusCode || "").toUpperCase() === "DUE" ||
                              (lesseeRow?.PaymentStatusCode || "").toUpperCase() === "BOTH DUE" ||
                              (lesseeRow?.PaymentStatusCode || "").toUpperCase() === "ALL DUE"
                            ? "bg-red-100 text-red-700 ring-red-600/20"
                            : "bg-amber-100 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        {lesseeRow?.PaymentStatusCode || "-"}
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
