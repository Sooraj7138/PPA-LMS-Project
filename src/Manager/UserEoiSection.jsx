export default function UserEoiSection({ eoiRows, formatDateOnly }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">View User's EOI</h3>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">EOI ID</th>
                <th className="px-6 py-4">Consumer Name</th>
                <th className="px-6 py-4">Land Type</th>
                <th className="px-6 py-4">Land Name</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {eoiRows.map((eoiRow, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{eoiRow?.EOIID}</td>
                  <td className="px-6 py-4 font-bold text-[#0b1f3b]">{eoiRow?.EOIConsumerName}</td>
                  <td className="px-6 py-4 text-slate-600">{eoiRow?.EOILandType}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{eoiRow?.EOILandName}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{formatDateOnly(eoiRow?.EOIAppliedDate)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold ring-1 ring-inset ring-blue-600/20">
                      {eoiRow?.EOIStatus}
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
