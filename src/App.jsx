import React from 'react'
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from 'react';
import MyLandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import Dashboard from './pages/Dashboard';
import ActivityPage from './pages/ActivityPage';
import NutritionPage from './pages/NutritionPage';

const App = () => {

  const [setIsAuthenticated] = useState(false);

  return (
    <>
    <Routes>
      <Route path="/" element={<MyLandingPage />} />

      <Route
        path="/signin"
        element={<SignInPage setIsAuthenticated={setIsAuthenticated} />}
      />

      <Route
        path="/dashboard" element={<Dashboard />}/>

      <Route path="/activity" element={<ActivityPage />} />

      <Route path="/nutrition" element={<NutritionPage />} />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default App