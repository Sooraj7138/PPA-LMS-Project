import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function DemandsSection({ demandRows, formatDateOnly, authToken, onDemandChanged }) {
  const [actionDemandId, setActionDemandId] = useState(null);

  async function updateDemandStatus(demandNoteId, action) {
    try {
      setActionDemandId(demandNoteId);
      const endpoint =
        action === "issue"
          ? `${API_BASE}/api/demand-notes/${demandNoteId}/issue`
          : `${API_BASE}/api/demand-notes/${demandNoteId}/reject`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: action === "reject" ? JSON.stringify({ reason: "" }) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      onDemandChanged?.();
    } catch (err) {
      alert(err?.message || `Failed to ${action} demand note.`);
    } finally {
      setActionDemandId(null);
    }
  }

  function sanitizeFileNamePart(value) {
    const cleaned = String(value || "")
      .trim()
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_")
      .replace(/\.+$/g, "");
    return cleaned || "DemandNote";
  }

  async function downloadDemand(demandNoteId, fileName, consumerName) {
    try {
      const res = await fetch(`${API_BASE}/api/demand-notes/${demandNoteId}/download`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `${sanitizeFileNamePart(consumerName)}_DemandNote_${demandNoteId}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err?.message || "Failed to download demand note.");
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">View Demand Notes</h3>

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
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demandRows.map((row, idx) => {
                const status = row?.DemandStatus || "Generated";
                const statusUpper = String(status).toUpperCase();
                const isGenerated = status === "Generated";
                const isBusy = actionDemandId === row?.DemandNoteID;
                return (
                  <tr key={row?.DemandNoteID || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0b1f3b]">{row?.name || "-"}</td>
                    <td className="px-6 py-4 text-slate-600">{row?.type || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row?.land || "-"}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{row?.leaseTenure || "-"}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{formatDateOnly(row?.dueDate)}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{formatDateOnly(row?.demandGenerationDate)}</td>
                    <td className="px-6 py-4 text-center">
                      {row?.DemandNoteID ? (
                        <button
                          type="button"
                          onClick={() => downloadDemand(row.DemandNoteID, row.DocumentFileName, row.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1a6faf] text-[#1a6faf] rounded-lg text-xs font-bold hover:bg-[#1a6faf]/10 transition-all"
                        >
                          Download
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
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
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          type="button"
                          disabled={!isGenerated || isBusy}
                          onClick={() => updateDemandStatus(row.DemandNoteID, "issue")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 disabled:opacity-50 transition-all shadow-sm w-full justify-center"
                        >
                          {isBusy ? "..." : "Issue"}
                        </button>
                        <button
                          type="button"
                          disabled={!isGenerated || isBusy}
                          onClick={() => updateDemandStatus(row.DemandNoteID, "reject")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-all shadow-sm w-full justify-center"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {demandRows.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-slate-500">
                    No demand notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
