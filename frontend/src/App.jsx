import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import MainLayout from "./layouts/MainLayout";
import AccueilPage from "./pages/AccueilPage";
import RecherchePage from "./pages/RecherchePage";
import DepotAnnoncePage from "./pages/DepotAnnoncePage";
import FicheAnnoncePage from "./pages/FicheAnnoncePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<RecherchePage />} />
          <Route path="/home" element={<AccueilPage />} />
          <Route path="/depot-annonce" element={<DepotAnnoncePage />} />
          <Route path="/annonce/:id" element={<FicheAnnoncePage />} />
          <Route path="/categories/:slug" element={<RecherchePage />} />
        </Route>
        <Route path="*" element={<RecherchePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
