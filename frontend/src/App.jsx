import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import HomePage from "./components/HomePage";
import SearchPage from "./components/SearchPage";
import SellerProfilePage from "./pages/SellerProfilePage";
import DepotAnnoncePage from "./pages/DepotAnnoncePage";
import FicheAnnoncePage from "./pages/FicheAnnoncePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SingupPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<SearchPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/depot-annonce" element={<DepotAnnoncePage />} />
        <Route path="/annonce/:id" element={<FicheAnnoncePage />} />
        <Route path="/vendeur/:id" element={<SellerProfilePage />} />
        <Route path="/connexion" element={<SignupPage/>}/>
        <Route path="/inscription" element={<LoginPage/>}/>


        {/* Route 404 - Page non trouvée */}
        <Route path="*" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
