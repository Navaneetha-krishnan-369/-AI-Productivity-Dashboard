import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart2, BrainCircuit } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/add-entry', name: 'Add Entry', icon: <PlusCircle size={20} /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart2 size={20} /> },
    { path: '/ai-insights', name: 'AI Insights', icon: <BrainCircuit size={20} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <BrainCircuit className="logo-icon" size={28} />
        <h2>Productivity AI</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
