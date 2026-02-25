export default function DemandStatusSection({ demandRows }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">View Demand Notes</h3>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Type</label>
            <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
              <option value="">All Types</option>
              <option value="lease">Lease</option>
              <option value="market">Market</option>
              <option value="license">License</option>
              <option value="row">ROW</option>
              <option value="openspace">Open Space</option>
              <option value="building">Building</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Name</label>
            <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
              <option value="">All Names</option>
              <option value="plot-a12">Plot A-12</option>
              <option value="shop-m05">Shop M-05</option>
              <option value="license-l08">License L-08</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Code</label>
            <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
              <option value="">All Codes</option>
              <option value="L001">L001</option>
              <option value="M002">M002</option>
              <option value="LC003">LC003</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Consumer Name</th>
                <th className="px-6 py-4">Land Type</th>
                <th className="px-6 py-4">Land Name</th>
                <th className="px-6 py-4 text-center">Lease Tenure</th>
                <th className="px-6 py-4 text-center">Due Date</th>
                <th className="px-6 py-4 text-center">Demand Generation Date</th>
                <th className="px-6 py-4 text-center">Demand Note</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demandRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row.name}</td>
                  <td className="px-6 py-4 text-slate-600">{row.type}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{row.land}</td>
                  <td className="px-6 py-4 text-center text-slate-500">
                    {row.leaseTenure ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500">
                    {row.dueDate ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500">
                    {row.demandGenerationDate ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => row.onReview?.(row)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1a6faf] text-[#1a6faf] rounded-lg text-xs font-bold hover:bg-[#1a6faf]/10 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3C5 3 1.73 7.11 1.05 9.78a1 1 0 000 .44C1.73 12.89 5 17 10 17s8.27-4.11 8.95-6.78a1 1 0 000-.44C18.27 7.11 15 3 10 3zm0 11a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      Review
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        onClick={() => row.onIssue?.(row)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm w-full justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                        Issue
                      </button>
                      <button
                        onClick={() => row.onReject?.(row)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-sm w-full justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reject
                      </button>
                    </div>
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