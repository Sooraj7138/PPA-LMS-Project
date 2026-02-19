export default function DemandStatusSection() {
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
              {[
                { name: "John Doe", type: "Lease", land: "Plot A-12", date: "15/07/2023", status: "Approved", payment: "Paid" },
                { name: "Jane Smith", type: "Market", land: "Shop M-05", date: "30/06/2023", status: "Action Needed", payment: "Not Paid" },
                { name: "Robert Johnson", type: "License", land: "License L-08", date: "10/07/2023", status: "Approved", payment: "Closed" },
                { name: "Michael Wilson", type: "Building", land: "Building B-03", date: "25/07/2023", status: "Approved", payment: "Not Paid" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row.name}</td>
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
