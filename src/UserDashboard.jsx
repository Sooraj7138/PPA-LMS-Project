import HomePage from './User/HomePage'
import ProfilePage from './User/UserProfile'
import MapPage from './User/MapPage'
import { formatDateOnly } from './utils'

export default function UserDashboard({ allData, userPage, authToken }) {
  const paymentRows = Array.isArray(allData?.userData) ? allData.userData : [];
  const profileRows = Array.isArray(allData?.userProfile) ? allData.userProfile : [];
  return (
    <div className="dashboard-layout manager-dashboard-layout flex flex-col gap-6">
      <div className="dashboard-content manager-dashboard-content min-w-0">
        {userPage === "user-data" &&
        <HomePage paymentRows={paymentRows} formatDateOnly={formatDateOnly} authToken={authToken} />
        }
        {userPage === "view-profile" &&
        <ProfilePage profileRows={profileRows} formatDateOnly={formatDateOnly} />
        }
        {userPage === "Eoi-map" &&
        <MapPage />
        }
      </div>
    </div>
  );
}
