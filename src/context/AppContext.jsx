import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Wizard navigation step (1: Search/Splash, 2: Vehicle Specs & Upsize, 3: Terrain Selection, 4: Recommendations Carousel)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Selected state
  const [vehicleData, setVehicleData] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedTerrain, setSelectedTerrain] = useState('city');
  const [recommendations, setRecommendations] = useState(null);
  const [selectedTier, setSelectedTier] = useState('recommended'); // budget | recommended | premium
  
  // Add-ons for upselling modal
  const [selectedAddons, setSelectedAddons] = useState([
    { id: 'alignment', title: 'Wheel Alignment & Balancing', price: 499, selected: true },
    { id: 'nitrogen', title: 'Nitrogen Gas Inflation (All 4)', price: 199, selected: true },
    { id: 'valve', title: 'Heavy Duty Tubeless Valves (4 Pcs)', price: 299, selected: false }
  ]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Admin Auth state
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('smart_tire_admin_token') || null);

  const toggleAddon = (id) => {
    setSelectedAddons(prev => prev.map(addon => 
      addon.id === id ? { ...addon, selected: !addon.selected } : addon
    ));
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setVehicleData(null);
    setSelectedSize('');
    setSelectedTerrain('city');
    setRecommendations(null);
    setError(null);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('smart_tire_admin_token');
    setAdminToken(null);
  };

  return (
    <AppContext.Provider value={{
      currentStep,
      setCurrentStep,
      vehicleData,
      setVehicleData,
      selectedSize,
      setSelectedSize,
      selectedTerrain,
      setSelectedTerrain,
      recommendations,
      setRecommendations,
      selectedTier,
      setSelectedTier,
      selectedAddons,
      toggleAddon,
      isLoading,
      setIsLoading,
      error,
      setError,
      adminToken,
      setAdminToken,
      logoutAdmin,
      resetFlow
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
