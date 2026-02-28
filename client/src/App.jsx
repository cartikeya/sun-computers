import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
// We will build these 3 pages next!





function App() {
  return (
    <Router>
      <Routes>
        {/* The main public website */}
        <Route path="/" element={<LandingPage />} />
        
        {/* The secret login door */}
        <Route path="/login" element={<Login />} />
        
        {/* The protected dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;