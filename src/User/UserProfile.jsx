import { Fragment } from "react";

export default function UserProfile({ allData, formatDateOnly }) {
  const getValue = (row, keys) => {
    for (const key of keys) {
      const value = row?.[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return "-";
  };

  const getDateValue = (row, keys) => {
    for (const key of keys) {
      const value = row?.[key];
      if (value !== undefined && value !== null && value !== "") {
        return formatDateOnly(value);
      }
    }
    return "-";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">User Profile</h3>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="flex flex-row justify-between bg-gradient-to-r from-[#0b1f3b] to-[#163d6b] px-6 py-4">
            <div className="flex flex-col justify-center">
              <h4 className="text-white font-semibold text-xl tracking-wide">
                Personal Information
              </h4>
            </div>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody className="divide-y divide-slate-200">
              {allData.map((data, idx) => {
                const paymentRow = data?.userData || {};
                const Lessee = data?.Lessee || {};
                
                return (
                <Fragment key={idx}>
                  <ProfileRow label="Company Name" value={getValue(paymentRow, ["company", "Company", "CompanyName"])} />
                  <ProfileRow label="Type of Organisation" value={getValue(Lessee, ["CategoryCode"])} />
                  <ProfileRow label="Authority Name" value={getValue(paymentRow, ["Username"])} />
                  <ProfileRow label="Email" value={getValue(paymentRow, ["EmailID"])} />
                  <ProfileRow label="Phone" value={getValue(paymentRow, ["ContactNo"])} />
                  <ProfileRow label="Permanent Address" value={getValue(paymentRow, ["Address"])} />
                  <ProfileRow label="Allotment Date" value={getDateValue(paymentRow, ["allotmentDate", "AllotmentDate"])} />
                  <ProfileRow label="Lease / License / Open Space" value={getValue(Lessee, ["LandType"])} />
                  <ProfileRow label="Area" value={getValue(paymentRow, ["area", "Area"])} />

                  <tr>
                    <td className="px-6 py-4 font-semibold bg-slate-50 w-1/3">
                      Payment Status
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 ring-1 ring-red-600/20">
                        {getValue(paymentRow, ["PaymentStatus", "paymentStatus", "Status"])}
                      </span>
                    </td>
                  </tr>

                  <ProfileRow label="Renewal Done On" value={getDateValue(paymentRow, ["renewalDate", "RenewalDate"])} />
                </Fragment>
                );})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-semibold text-md bg-slate-50 w-1/3">
        {label}
      </td>
      <td className="px-6 py-4 text-slate-700 text-md font-medium">
        {value || "-"}
      </td>
    </tr>
  );
}
