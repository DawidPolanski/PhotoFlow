import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PhotoDetail from "./pages/PhotoDetailPage"; // Importuj nowy komponent
import MainLayout from "./components/layouts/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/photo/:id"
          element={
            <MainLayout>
              <PhotoDetail />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
