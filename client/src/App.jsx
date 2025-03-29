import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import HealthcareDashboard from "./pages/Dashboards/Healthcare/HealthcareDashboard";
import EducationDashboard from "./pages/Dashboards/Education/EducationDashboard";
import VolunteerDashboard from "./pages/Dashboards/Volunteer/VolunteerDashboard";
import DonorDashboard from "./pages/Dashboards/Donor/DonorDashboard";
import VolunteerOpportunities from "./pages/Dashboards/Volunteer/VolunteerOpportunities";
import ProtectedRoute from "./components/ProtectedRoute";
import HealthcareSurvey from "./components/HealthcareSurvey";
import EducationSurvey from "./components/EducationSurvey";
import AssistHealthcareCamp from "./components/AssistHealthcareCamp";
import HelpTeachingPrograms from "./components/HelpTeachingPrograms";
import Navbar from "./components/Navbar";
import CompletedTasks from "./components/CompletedTasks";
import { useParams } from "react-router-dom"; // ✅ Import useParams

// ✅ Dynamic Component Loader
const OpportunityDetails = () => {
  const { category, id } = useParams();

  switch (category) {
    case "Healthcare-Surveys":
      return <HealthcareSurvey id={id} />;
    case "Education-Surveys":
      return <EducationSurvey id={id} />;
    case "Healthcare-Camps":
      return <AssistHealthcareCamp id={id} />;
    case "Teaching-Programs":
      return <HelpTeachingPrograms id={id} />;
    default:
      return <h2>Opportunity Not Found</h2>;
  }
};

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* ✅ Volunteer Routes */}
        <Route element={<ProtectedRoute requiredRole="volunteer" />}>
          <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
          <Route path="/opportunities" element={<VolunteerOpportunities />} />
          <Route path="/opportunities/:category/:id" element={<OpportunityDetails />} />
          <Route path="/completed-tasks" element={<CompletedTasks/>}/>
        </Route>

        {/* ✅ Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="healthcare" />}>
          <Route path="/dashboard/healthcare" element={<HealthcareDashboard />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="learner" />}>
          <Route path="/dashboard/education" element={<EducationDashboard />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="donor" />}>
          <Route path="/dashboard/donor" element={<DonorDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
