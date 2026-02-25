import { useEffect } from 'react'
import GenerateDemandSection from './manager/GenerateDemandSection'
import MasterLandDataSection from './manager/MasterLandDataSection'
import UserDataSection from './manager/UserDataSection'
import DemandStatusSection from './Manager/DemandStatusSection'
import UserEoiSection from './manager/UserEoiSection'
import { formatDateOnly, normalizeLandType } from './utils'

export default function ManagerDashboard({ allData, managerPage }) {
  const landRows = Array.isArray(allData?.landData) ? allData.landData : [];
  const lesseeRows = Array.isArray(allData?.lesseeData) ? allData.lesseeData : [];
  const eoiRows = Array.isArray(allData?.eoiData) ? allData.eoiData : [];
  const demandRows = Array.isArray(allData?.demandNotes) ? allData.demandNotes : [];

  useEffect(() => {
    const hasLessee = lesseeRows.length > 0;
    const hasLand = landRows.length > 0;
    if (!hasLessee && !hasLand) return;
    console.log("ManagerDashboard allData:", allData);
  }, [allData, lesseeRows.length, landRows.length]);

  return (
    <div className="manager-dashboard-layout flex flex-col gap-6">
      <div className="manager-dashboard-content min-w-0">
        {managerPage === "generate-demand" && (
          <GenerateDemandSection lesseeRows={lesseeRows} landRows={landRows} formatDateOnly={formatDateOnly} />
        )}
        {managerPage === "master-land" && (
          <MasterLandDataSection landRows={landRows} normalizeLandType={normalizeLandType} />
        )}
        {managerPage === "user-data" && <UserDataSection lesseeRows={lesseeRows} landRows={landRows} />}
        {managerPage === "demand-status" && <DemandStatusSection lesseeRows={lesseeRows} landRows={landRows} demandRows={demandRows} formatDateOnly={formatDateOnly} />}
        {managerPage === "user-eoi" && <UserEoiSection eoiRows={eoiRows} formatDateOnly={formatDateOnly} />}
      </div>
    </div>
  );
}
