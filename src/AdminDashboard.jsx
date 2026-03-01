import { useEffect } from 'react'
import UserEoiSection from './manager/UserEoiSection';
import DemandsSection from './Admin/DemandsSection';
import MapPage from './User/MapPage';
import { formatDateOnly } from './utils'

export default function AdminDashboard({ allData, adminPage, authToken, onDemandChanged }) {
  const eoiRows = Array.isArray(allData?.eoiData) ? allData.eoiData : [];
  const demandRows = Array.isArray(allData?.demandNotes) ? allData.demandNotes : [];

  useEffect(() => {
    const hasData = eoiRows.length > 0;
    if (!hasData) return;
    console.log("AdminDashboard allData:", allData);
  }, [allData, eoiRows.length]);

  return (
    <div className="admin-dashboard-layout manager-dashboard-layout flex flex-col gap-6">
      <div className="admin-dashboard-content manager-dashboard-content min-w-0">
{adminPage === "demand-notes" && (
  <DemandsSection
    demandRows={demandRows}
    formatDateOnly={formatDateOnly}
    authToken={authToken}
    onDemandChanged={onDemandChanged}
  />
)}

        {adminPage === "eoi-data" && (
          <UserEoiSection
            eoiRows={eoiRows}
            formatDateOnly={formatDateOnly}
          />
        )}

        {adminPage === "Eoi-map" && <MapPage />}
      </div>
    </div>
  );
}
