export default function UserProfile({ user, paymentRows, formatDateOnly }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#0b1f3b]">User Profile</h3>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-row justify-between bg-gradient-to-r from-[#0b1f3b] to-[#163d6b] px-6 py-4">
          <div className="flex flex-col justify-center">
            <h4 className="text-white font-semibold text-xl tracking-wide">
            Personal Information
          </h4>
          </div>
          <div className="flex flex-col  w-[250px] min-w-0">
            <p className="text-white font-semibold break-words">UserID:</p>
            <p className="text-white font-semibold break-words">Username:</p>
          </div>
        </div>

        {/* Table */}
        {paymentRows.map((paymentRow)=>(
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody className="divide-y divide-slate-200">

                <ProfileRow label="Company Name" value={user?.company} />
                <ProfileRow label="Type of Organisation" value={paymentRow?.CategoryCode} />
                <ProfileRow label="Authority Name" value={paymentRow?.authority} />
                <ProfileRow label="Email" value={paymentRow?.EmailID} />
                <ProfileRow label="Phone" value={paymentRow?.ContactNo} />
                <ProfileRow label="Permanent Address" value={paymentRow?.Address} />
                <ProfileRow label="Allotment Date" value={user?.allotmentDate} />
                <ProfileRow label="Lease / License / Open Space" value={user?.leaseType} />
                <ProfileRow label="Area" value={user?.area} />

                <tr>
                  <td className="px-6 py-4 font-semibold bg-slate-50 w-1/3">
                    Payment Status
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 ring-1 ring-red-600/20">
                      Not Paid
                    </span>
                  </td>
                </tr>

                <ProfileRow label="Renewal Done On" value={user?.renewalDate} />

              </tbody>
            </table>
          </div>
        ))}
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