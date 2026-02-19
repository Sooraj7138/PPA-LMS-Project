import { useState } from 'react'

export default function GenerateDemandSection({ lesseeRows, landRows, formatDateOnly }) {
  const [isGenerateDemandModalOpen, setIsGenerateDemandModalOpen] = useState(false);
  const [demandForm, setDemandForm] = useState({
    amount: "",
    dueDate: "",
    description: "",
  });

  function openGenerateDemandModal() {
    setIsGenerateDemandModalOpen(true);
  }

  function closeGenerateDemandModal() {
    setIsGenerateDemandModalOpen(false);
  }

  function onDemandFormChange(e) {
    const { name, value } = e.target;
    setDemandForm((prev) => ({ ...prev, [name]: value }));
  }

  function submitGenerateDemand() {
    const { amount, dueDate, description } = demandForm;
    if (amount.trim() !== "" && dueDate !== "" && description.trim() !== "") {
      alert("Demand note generated successfully!");
      closeGenerateDemandModal();
      setDemandForm({ amount: "", dueDate: "", description: "" });
      return;
    }
    alert("Please fill all fields.");
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-[#0b1f3b]">Generate Demand Note</h3>
        </div>

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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Land Code</label>
              <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                <option value="">All Codes</option>
                <option value="L001">L001</option>
                <option value="M002">M002</option>
                <option value="LC003">LC003</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Allotment Type</label>
              <select className="w-full rounded-lg border-slate-200 text-sm p-2.5 border bg-slate-50/50 focus:ring-2 focus:ring-[#0b1f3b]/10 focus:border-[#0b1f3b] transition-all">
                <option value="">--</option>
                <option value="Upfront">Upfront</option>
                <option value="Annual">Annual</option>
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
                  <th className="px-6 py-4 text-center">Due Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lesseeRows.map((lesseeRow, idx) => {
                  const landRow = landRows[idx];
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0b1f3b]">{lesseeRow?.LesseeName || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{lesseeRow?.LandType || landRow?.LandType || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{lesseeRow?.LandName || landRow?.LandName || "-"}</td>
                      <td className="px-6 py-4 text-center text-slate-500 font-medium">{formatDateOnly(lesseeRow?.LeaseEndDate)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={openGenerateDemandModal}
                          className="inline-flex items-center px-4 py-2 bg-[#0b1f3b] text-white rounded-lg text-xs font-bold hover:bg-[#1f4f82] transition-all active:scale-95 shadow-sm"
                        >
                          <img src="https://api.iconify.design/lucide-file-plus.svg?color=white" alt="" className="w-4 h-4 mr-1.5" />
                          Generate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isGenerateDemandModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
          onClick={closeGenerateDemandModal}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="generate-demand-modal-title"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h4 id="generate-demand-modal-title" className="text-lg font-bold text-[#0b1f3b]">
                Generate Demand Note
              </h4>
              <button
                type="button"
                onClick={closeGenerateDemandModal}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <img src="https://api.iconify.design/lucide-x.svg?color=%234b5563" alt="" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="space-y-1.5">
                <label htmlFor="demand-amount" className="text-sm font-semibold text-slate-700">
                  Amount
                </label>
                <input
                  id="demand-amount"
                  name="amount"
                  type="text"
                  value={demandForm.amount}
                  onChange={onDemandFormChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0b1f3b] focus:outline-none focus:ring-2 focus:ring-[#0b1f3b]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="demand-due-date" className="text-sm font-semibold text-slate-700">
                  Due Date
                </label>
                <input
                  id="demand-due-date"
                  name="dueDate"
                  type="date"
                  value={demandForm.dueDate}
                  onChange={onDemandFormChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0b1f3b] focus:outline-none focus:ring-2 focus:ring-[#0b1f3b]/10"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="demand-description" className="text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  id="demand-description"
                  name="description"
                  rows="3"
                  value={demandForm.description}
                  onChange={onDemandFormChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0b1f3b] focus:outline-none focus:ring-2 focus:ring-[#0b1f3b]/10"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={closeGenerateDemandModal}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitGenerateDemand}
                className="rounded-lg bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4f82]"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
