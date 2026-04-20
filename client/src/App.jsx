import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import Login from './pages/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('username') || null);

  const handleLogin = (username) => {
    localStorage.setItem('username', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-layout">
        <Sidebar onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/add-entry" element={<AddEntry user={user} />} />
            <Route path="/analytics" element={<Analytics user={user} />} />
            <Route path="/ai-insights" element={<AIInsights user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
