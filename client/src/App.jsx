import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Hero from "./pages/Hero";
import Home from "./pages/Home";
import Sidebar from "./pages/Sidebar";
import Suggestion from "./pages/Suggestion";

const AppContent = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";

  return (
    <div className="flex h-screen">
      {/* Sidebar only if not on "/" */}
      {!hideSidebar && <Sidebar />}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/home" element={<Home />} />
          <Route path="/suggestion" element={<Suggestion />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
