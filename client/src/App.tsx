import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import React from 'react';
import CookieConsent from './components/cookies/CookieConsent';
import Register from './pages/Register/Register';
import Login from "./pages/Login/Login";
import ToastContainer from 'react-hot-toast';
import Dashboard from './pages/dashboard/Dashboard';
import AddExpense from './pages/AddExpense/AddExpense';
import AddBudget from './pages/AddBudget/AddBudget';
import AddCategory from './pages/AddCategory/AddCategory';
import AllExpenses from './pages/AllExpenses/AllExpenses';
import UserProfile from './pages/UserProfile/UserProfile';

function App() {
  return (
    <BrowserRouter>
      {/* add CookieConsent here to appear on all the pages */}
      {/* <CookieConsent />   */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/addexpense" element={<AddExpense/>} />
        <Route path="/addbudget" element={<AddBudget />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/allexpenses" element={<AllExpenses />} />
        <Route path="/profile/:userId" element={<UserProfile />} /> {/* Fixed this line */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;