import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import LocationDetail from './pages/LocationDetail';
import AllLocations from './pages/AllLocations';
import './App.css';

import locations from './lib/locations-seed';

function RandomRedirect() {
  const randomLoc = locations[Math.floor(Math.random() * locations.length)];
  return <Navigate to={`/location/${randomLoc.slug}`} replace />;
}

export default function App() {
  const [authModal, setAuthModal] = useState(null); // null | 'login' | 'signup'

  const handleAuthClick = (mode) => setAuthModal(mode);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div id="app">
          <Navbar onAuthClick={handleAuthClick} />

          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<AllLocations />} />
              <Route
                path="/location/:slug"
                element={<LocationDetail onAuthClick={handleAuthClick} />}
              />
              <Route path="/random" element={<RandomRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Auth Modal */}
          {authModal && (
            <AuthModal
              mode={authModal}
              onClose={() => setAuthModal(null)}
            />
          )}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
