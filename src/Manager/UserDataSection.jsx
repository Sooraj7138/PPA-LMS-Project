export default function UserDataSection({ lesseeRows, landRows }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">User's Data</h3>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="space-y-1.5">
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
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Mobile Number</th>
                <th className="px-6 py-4">Allotted Land</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lesseeRows.map((lesseeRow, idx) => {
                const landRow = landRows[idx];
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0b1f3b]">{lesseeRow?.LesseeName || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs leading-relaxed max-w-[200px]">{lesseeRow?.Address || "-"}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">{lesseeRow?.ContactNo || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {lesseeRow?.LandName || landRow?.LandName || "-"} - {lesseeRow?.LandType || landRow?.LandType || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1.5 text-amber-600 bg-amber-50 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors">Edit</button>
                        <button className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">Delete</button>
                      </div>
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
