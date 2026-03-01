import { useState } from "react";
import { createPortal } from "react-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function GenerateDemandSection({ lesseeRows, landRows, formatDateOnly, authToken, onDemandGenerated }) {
  const [generatingLeaseId, setGeneratingLeaseId] = useState(null);
  const [previewRow, setPreviewRow] = useState(null);

  async function generateDemandForRow(lesseeRow) {
    if (!lesseeRow?.LesseeID) {
      alert("Unable to identify lessee for this row.");
      return;
    }

    const leaseKey = lesseeRow?.LeaseID || `lessee-${lesseeRow.LesseeID}`;
    try {
      setGeneratingLeaseId(leaseKey);
      const res = await fetch(`${API_BASE}/api/demand-notes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          lesseeId: lesseeRow.LesseeID,
          leaseId: lesseeRow.LeaseID || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      onDemandGenerated?.();
      alert("Demand note generated.");
    } catch (err) {
      alert(err?.message || "Failed to generate demand note.");
    } finally {
      setGeneratingLeaseId(null);
    }
  }

  function openPreview(lesseeRow, landRow) {
    setPreviewRow({ lesseeRow, landRow });
  }

  function closePreview() {
    setPreviewRow(null);
  }

  async function confirmGenerate() {
    if (!previewRow?.lesseeRow) return;
    await generateDemandForRow(previewRow.lesseeRow);
    closePreview();
  }

  const modalContent = previewRow ? (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 px-4 py-6"
      onClick={closePreview}
    >
      <div
        className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demand-note-preview-title"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h4 id="demand-note-preview-title" className="text-lg font-bold text-[#0b1f3b]">
            Demand Note Preview
          </h4>
          <button
            type="button"
            onClick={closePreview}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <img src="https://api.iconify.design/lucide-x.svg?color=%234b5563" alt="" className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[85vh] overflow-y-auto px-8 py-6 text-[13px] text-slate-800 leading-relaxed">
          <div className="text-center font-bold text-base">PARADIP PORT AUTHORITY</div>
          <div className="text-center font-bold text-[15px]">ADMINISTRATIVE DEPARTMENT</div>
          <div className="text-center font-bold text-[15px] mb-6 border-b border-slate-400 pb-1">(ESTATE WING)</div>

          <p className="mb-2">
            No.AD/EST/LAND-I-______ /20____ /&nbsp;&nbsp;Dt. ___________
          </p>

          <p className="mb-0">To</p>
          <p className="ml-6 italic mb-0">{previewRow.lesseeRow?.LesseeName || "[Name of the Organization]"}</p>
          <p className="ml-6 italic mb-0">[Department / Office Name]</p>
          <p className="ml-6 italic mb-0">{previewRow.lesseeRow?.Address || "[Address Line 1]"}</p>
          <p className="ml-6 italic mb-4">[City - PIN Code]</p>

          <p className="mb-3">
            <span className="font-semibold">Sub:-</span> Renewal of Port land measuring{" "}
            <span className="underline">{previewRow.lesseeRow?.TotalArea || "______"}</span> Ac. for the period of{" "}
            <span className="underline">______</span> years i.e. up to{" "}
            <span className="underline">{formatDateOnly(previewRow.lesseeRow?.DateTo) !== "-" ? formatDateOnly(previewRow.lesseeRow?.DateTo) : "__________"}</span>{" "}
            from the date of expiry for <em>[purpose/description of use]</em> at Paradip.
          </p>

          <p className="mb-3">
            <span className="font-semibold">Ref:</span> Your letter dtd: <span className="underline">___________</span>
          </p>

          <p className="mb-2">Sir,</p>

          <p className="mb-3 text-justify">
            The Board of PPA have approved vide their Resolution No-<span className="underline">__________</span> on{" "}
            <span className="underline">__________</span> for renewal of port land measuring{" "}
            <span className="underline">{previewRow.lesseeRow?.TotalArea || "______"}</span> Ac. in favour of the{" "}
            <em>{previewRow.lesseeRow?.LesseeName || "[Name of Organization]"}</em> for the period of{" "}
            <span className="underline">______</span> years from{" "}
            <span className="underline">{formatDateOnly(previewRow.lesseeRow?.DateFrom) !== "-" ? formatDateOnly(previewRow.lesseeRow?.DateFrom) : "__________"}</span>{" "}
            to{" "}
            <span className="underline">{formatDateOnly(previewRow.lesseeRow?.DateTo) !== "-" ? formatDateOnly(previewRow.lesseeRow?.DateTo) : "__________"}</span>{" "}
            treating it as a fresh lease with a concession of <span className="underline">______</span>% on land premium at the latest market value notified by TAMP.
          </p>

          <p className="mb-3 text-justify">
            Based on the approval of Board, the demand note for the period up to{" "}
            <span className="underline">{formatDateOnly(previewRow.lesseeRow?.LeaseEndDate) !== "-" ? formatDateOnly(previewRow.lesseeRow?.LeaseEndDate) : "__________"}</span>{" "}
            is enclosed as <span className="font-semibold underline">Annexure-I</span> for necessary payment of{" "}
            <span className="font-semibold">Rs. ________________/-</span> (<span className="italic underline">Rupees _____________________________________________ Only</span>). The advance premium calculation is based on the latest yield notified by RBI i.e.{" "}
            <span className="underline">______</span> for the month of <span className="underline">___________</span>.
          </p>

          <p className="mb-4 text-justify">
            Hence, you are requested to deposit the above amount within a period of <span className="font-semibold">01 month</span> from the date of issue of this demand note through Online/RTGS/NEFT to PPA A/c No.<span className="underline">___________________</span>, Paradip Branch(<span className="underline">_____</span>) IFSC:<span className="underline">_______________</span> and submit the copy of the transaction acknowledgement to the office for reference and record. You can also deposit the Demand Draft favoring "Paradip Port Authority" payable at Paradip for the <span className="underline">above mentioned</span> dues. After payment of same, process for lease agreement may be undertaken.
          </p>

          <p className="text-right mb-8">Yours faithfully,</p>
          <p className="text-right font-semibold mb-0">Sr. Asst. Estate Manager</p>
          <p className="text-right font-semibold mb-4">Paradip Port Authority</p>
          <p className="mb-2">Encl: As above</p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={closePreview}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            No
          </button>
          <button
            type="button"
            onClick={confirmGenerate}
            className="rounded-lg bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f4f82]"
          >
            Yes, Generate
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
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
                const leaseKey = lesseeRow?.LeaseID || `lessee-${lesseeRow?.LesseeID || idx}`;
                const isGenerating = generatingLeaseId === leaseKey;
                return (
                  <tr key={leaseKey} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0b1f3b]">{lesseeRow?.LesseeName || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{lesseeRow?.LandType || landRow?.LandType || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{lesseeRow?.LandName || landRow?.LandName || "-"}</td>
                    <td className="px-6 py-4 text-center text-slate-500 font-medium">{formatDateOnly(lesseeRow?.LeaseEndDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openPreview(lesseeRow, landRow)}
                        disabled={isGenerating}
                        className="inline-flex items-center px-4 py-2 bg-[#0b1f3b] text-white rounded-lg text-xs font-bold hover:bg-[#1f4f82] disabled:opacity-60 transition-all active:scale-95 shadow-sm"
                      >
                        <img src="https://api.iconify.design/lucide-file-plus.svg?color=white" alt="" className="w-4 h-4 mr-1.5" />
                        {isGenerating ? "Generating..." : "Generate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {typeof document !== "undefined" && modalContent ? createPortal(modalContent, document.body) : null}
    </div>
  );
}
