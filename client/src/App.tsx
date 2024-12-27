import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import React from 'react';
import CookieConsent from './common/cookies/CookieConsent';  // Import CookieConsent

function App() {
  return (
    <BrowserRouter>
    {/* add CookieConsent here to appear on all the pages */}
      <CookieConsent />  
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
