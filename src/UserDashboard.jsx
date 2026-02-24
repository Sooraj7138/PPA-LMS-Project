import { useEffect } from 'react'
import HomePage from './User/HomePage'
import ProfilePage from './User/UserProfile'
import MapPage from './User/MapPage'


export default function UserDashboard({ allData, userPage }) {

  const paymentRows = Array.isArray(allData?.demandNotes) ? allData.demandNotes : [];


  return (
    <div className="dashboard-layout flex flex-col gap-6">
      <div className="dashboard-content min-w-0">
        {userPage === "user-data" &&
        <HomePage paymentRows={paymentRows} />
        }
        {userPage === "view-profile" &&
        <ProfilePage />
        }
        {userPage === "Eoi-map" &&
        <MapPage />
        }
      </div>
    </div>
  );
}
