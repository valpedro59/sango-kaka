import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import HomePage from "./components/HomePage";
import SearchPage from "./components/SearchPage";
import DepotAnnoncePage from "./pages/DepotAnnoncePage";
import FicheAnnoncePage from "./pages/FicheAnnoncePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<SearchPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/depot-annonce" element={<DepotAnnoncePage />} />
        <Route path="/annonce/:id" element={<FicheAnnoncePage />} />

        {/* Route 404 - Page non trouvée */}
        <Route path="*" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
