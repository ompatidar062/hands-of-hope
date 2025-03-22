import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import HealthcareDashboard from "./pages/Dashboards/Healthcare/HealthcareDashboard";
import EducationDashboard from "./pages/Dashboards/Education/EducationDashboard";
import VolunteerDashboard from "./pages/Dashboards/Volunteer/VolunteerDashboard";
import DonorDashboard from "./pages/Dashboards/Donor/DonorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* ✅ Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="healthcare" />}>
          <Route path="/dashboard/healthcare" element={<HealthcareDashboard />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="learner" />}>
          <Route path="/dashboard/education" element={<EducationDashboard />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="volunteer" />}>
          <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="donor" />}>
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
