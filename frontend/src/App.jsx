import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PlanTrip from './pages/PlanTrip';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import './index.css';

function App() {
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (authUser) localStorage.setItem('authUser', JSON.stringify(authUser));
    else localStorage.removeItem('authUser');
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <div className="app-container">
        <Navbar authUser={authUser} setAuthUser={setAuthUser} theme={theme} toggleTheme={toggleTheme} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/plan" element={<PlanTrip />} />
          <Route path="/dashboard" element={<Dashboard authUser={authUser} />} />
          <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
          <Route path="/register" element={<Register setAuthUser={setAuthUser} />} />
        </Routes>
        
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
