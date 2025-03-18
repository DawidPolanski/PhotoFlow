import { BrowserRouter as Router } from "react-router-dom";
import HomeRoutes from "./routes/HomeRoute";
import RateLimitBanner from "./components/ui/RateLimitBanner";
import useRateLimitStore from "./store/useStore";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    useRateLimitStore.getState().setRemaining(1);
    useRateLimitStore.getState().setLimit(1);

    const resetInterval = setInterval(() => {
      useRateLimitStore.getState().setRemaining(1);
      useRateLimitStore.getState().setResetTime(null);
    }, 3600000);

    return () => clearInterval(resetInterval);
  }, []);

  return (
    <div className="relative">
      <RateLimitBanner />
      <Router>
        <HomeRoutes />
      </Router>
    </div>
  );
}

export default App;
