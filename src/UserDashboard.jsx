import { useEffect } from 'react'
import HomePage from './User/HomePage'
import ProfilePage from './User/UserProfile'
import MapPage from './User/MapPage'
import { formatDateOnly, normalizeLandType } from './utils'

export default function UserDashboard({ allData, userPage }) {
  const paymentRows = Array.isArray(allData?.userData) ? allData.userData : [];
  console.log("User Dashboard - Payment Rows:", paymentRows);
  return (
    <div className="dashboard-layout manager-dashboard-layout flex flex-col gap-6">
      <div className="dashboard-content manager-dashboard-content min-w-0">
        {userPage === "user-data" &&
        <HomePage paymentRows={paymentRows} formatDateOnly={formatDateOnly} />
        }
        {userPage === "view-profile" &&
        <ProfilePage paymentRows={paymentRows} formatDateOnly={formatDateOnly} />
        }
        {userPage === "Eoi-map" &&
        <MapPage />
        }
      </div>
    </div>
  );
}
