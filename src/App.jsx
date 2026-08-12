import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HomeView from './pages/HomeView';
import VehicleVerifyView from './pages/VehicleVerifyView';
import TerrainSelectView from './pages/TerrainSelectView';
import RecommendationsView from './pages/RecommendationsView';
import AdminDashboard from './pages/AdminDashboard';

const ClientWizard = () => {
  const { currentStep } = useApp();

  return (
    <main className="pb-12 pt-2 min-h-[calc(100vh-65px)] carbon-pattern">
      {currentStep === 1 && <HomeView />}
      {currentStep === 2 && <VehicleVerifyView />}
      {currentStep === 3 && <TerrainSelectView />}
      {currentStep === 4 && <RecommendationsView />}
    </main>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<ClientWizard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
