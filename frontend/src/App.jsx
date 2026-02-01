import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Event Pages
import CreateEvent from "./pages/ngo/CreateEvent";
import BrowseEvents from "./pages/volunteer/BrowseEvents";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboards
import NgoDashboard from "./pages/dashboards/NgoDashboard";
import VolunteerDashboard from "./pages/dashboards/VolunteerDashboard";
import DonorDashboard from "./pages/dashboards/DonorDashboard";

function App() {
  return (
    <>
      {/* Navbar visible on all pages */}
      <Navbar />

      {/* Application Routes */}
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <div className="p-6 text-center">
              <h1 className="text-2xl font-bold">
                Welcome to Lokasamyoga
              </h1>
              <p className="mt-2">
                Connecting NGOs and Volunteers through Events
              </p>
            </div>
          }
        />

        {/* NGO Routes */}
        <Route path="/ngo/create-event" element={<CreateEvent />} />
        <Route path="/dashboard/ngo" element={<NgoDashboard />} />

        {/* Volunteer Routes */}
        <Route path="/volunteer/events" element={<BrowseEvents />} />
        <Route
          path="/dashboard/volunteer"
          element={<VolunteerDashboard />}
        />

        {/* Donor Routes */}
        <Route path="/dashboard/donor" element={<DonorDashboard />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
