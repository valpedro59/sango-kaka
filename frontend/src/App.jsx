import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Pages
import AccueilPage from "./pages/AccueilPage";
import RecherchePage from "./pages/RecherchePage";
import DepotAnnoncePage from "./pages/DepotAnnoncePage";
import FicheAnnoncePage from "./pages/FicheAnnoncePage";
import SellerProfile from "./pages/SellerProfile";

// Auth
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SingupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<RecherchePage />} />
          <Route path="/home" element={<AccueilPage />} />
          <Route path="/depot-annonce" element={<DepotAnnoncePage />} />
          <Route path="/annonce/:id" element={<FicheAnnoncePage />} />
          <Route path="/vendeur/:id" element={<SellerProfile />} />
          <Route path="/categories/:slug" element={<RecherchePage />} />
        </Route>

        {/* Authentification */}
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<SignupPage />} />

        {/* Route 404 */}
        <Route path="*" element={<RecherchePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
