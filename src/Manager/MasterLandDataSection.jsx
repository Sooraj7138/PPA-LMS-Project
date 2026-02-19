import { useMemo, useState } from 'react'

export default function MasterLandDataSection({ landRows, normalizeLandType }) {
  const landTypes = ["Lease", "Market", "License", "ROW", "Open Space", "Building"];
  const [selectedLandType, setSelectedLandType] = useState("Lease");
  const landTypeTitle = `${selectedLandType} Land Data`;

  const filteredLandData = useMemo(
    () =>
      landRows.filter(
        (row) => normalizeLandType(row?.LandType) === normalizeLandType(selectedLandType)
      ),
    [landRows, normalizeLandType, selectedLandType]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-[#0b1f3b]">Master Land Data</h3>
        <button className="inline-flex items-center px-4 py-2.5 bg-[#0b1f3b] text-white rounded-lg text-sm font-bold hover:bg-[#1f4f82] transition-all active:scale-95 shadow-md">
          <img src="https://api.iconify.design/lucide-plus.svg?color=white" alt="" className="w-4 h-4 mr-2" />
          Add New Record
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 space-y-1">
            {landTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedLandType(type)}
                className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  type === selectedLandType ? "bg-[#0b1f3b] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h4 className="text-sm font-bold text-slate-700">{landTypeTitle}</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-white text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Area (sq.m)</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Total Rate</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLandData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row?.LandName || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{row?.TotalAreaSqFt ?? "-"}</td>
                      <td className="px-6 py-4 font-mono text-slate-500">{row?.DivisionNumber || "-"}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">{row?.TotalRate ?? "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <img src="https://api.iconify.design/lucide-edit.svg?color=%23d97706" alt="" className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <img src="https://api.iconify.design/lucide-trash-2.svg?color=%23dc2626" alt="" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLandData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                        No records found for {selectedLandType}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
