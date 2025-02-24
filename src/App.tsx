import { BrowserRouter as Router } from "react-router-dom";
import HomeRoutes from "./routes/HomeRoute";
import RateLimitBanner from "./components/ui/RateLimitBanner";

function App() {
  return (
    <div className="relative">
      <RateLimitBanner />{" "}
      <Router>
        <HomeRoutes />
      </Router>
    </div>
  );
}

export default App;
