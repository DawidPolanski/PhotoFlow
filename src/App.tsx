import { BrowserRouter as Router } from "react-router-dom";
import HomeRoutes from "./routes/HomeRoute";
import PhotoRoutes from "./routes/PhotoRoute";

function App() {
  return (
    <Router>
      <HomeRoutes />
      <PhotoRoutes />
    </Router>
  );
}

export default App;
