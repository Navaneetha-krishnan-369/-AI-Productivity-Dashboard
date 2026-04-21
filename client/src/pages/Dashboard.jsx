import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';
import Card from '../components/Card';
import { Clock, Focus, Target, AlertTriangle, Sparkles, Coffee } from 'lucide-react';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/entries?username=${user}`)
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Failed to fetch', err));
  }, []);

  const totalHours = entries.reduce((sum, e) => sum + (Number(e.totalHours) || 0), 0);
  const focusHours = entries.reduce((sum, e) => sum + (Number(e.focusHours) || 0), 0);
  const breakMinutes = entries.reduce((sum, e) => sum + (Number(e.breakTime) || 0), 0);
  const breakHours = breakMinutes / 60;
  
  const productivityScore = totalHours > 0 ? Math.round((focusHours / totalHours) * 100) : 0;

  let burnoutRisk = "Low";
  const isWorkingHard = totalHours > 40;
  const isNotResting = breakHours < (totalHours * 0.1); // less than 10% rest
  
  if ((totalHours > 50 && isNotResting) || (totalHours > 8 && isNotResting)) 
    burnoutRisk = "High";
  else if (totalHours > 50 || (isWorkingHard && isNotResting) || (totalHours > 8) || productivityScore < 40) 
    burnoutRisk = "Medium";

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="text-secondary">Welcome back. Here is your productivity overview.</p>
      </div>

      <div className="stats-grid">
        <Card
          title="Total Hours"
          value={`${totalHours.toFixed(1)}h`}
          subtitle="All time logged"
          icon={<Clock size={24} />}
        />
        <Card
          title="Focus Hours"
          value={`${focusHours.toFixed(1)}h`}
          subtitle="Total deep work"
          icon={<Target size={24} />}
        />
        <Card
          title="Productivity Score"
          value={`${productivityScore}/100`}
          subtitle="Based on focus ratio"
          icon={<Focus size={24} />}
        />
        <Card
          title="Total Break Time"
          value={`${breakHours.toFixed(1)}h`}
          subtitle="Cumulative rest taken"
          icon={<Coffee size={24} color="#8b5cf6" />}
        />
        <Card
          title="Burnout Risk"
          value={burnoutRisk}
          subtitle={burnoutRisk === 'Low' ? 'Healthy work pattern' : 'Take a break soon'}
          icon={
            <AlertTriangle
              size={24}
              color={
                burnoutRisk === 'High' ? 'var(--danger-color)' :
                  burnoutRisk === 'Medium' ? '#f59e0b' :
                    'var(--success-color)'
              }
            />
          }
        />
      </div>

      <div className="dashboard-content">
        <div className="chart-container">
          <h3 className="section-title">Recent Activity</h3>
          {entries.length > 0 ? (
            <div className="simple-bar-chart">
              {entries.slice(0, 7).reverse().map((entry, index) => {
                const maxHours = Math.max(...entries.map(e => Number(e.totalHours) || 0), 10);
                const heightPercent = Math.min(((Number(entry.totalHours) || 0) / maxHours) * 100, 100);
                const dayLabel = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });

                return (
                  <div className="bar-wrapper" key={entry._id || index}>
                    <div className="bar" style={{ height: `${heightPercent}%` }}></div>
                    <span>{dayLabel}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-secondary" style={{ marginTop: '2rem' }}>No entries found. Log your first day to see the chart!</p>
          )}
        </div>

        <div className="ai-insight-box">
          <div className="ai-header">
            <Sparkles className="ai-icon" size={24} />
            <h3>AI Insight</h3>
          </div>
          <p className="ai-message">
            {entries.length > 0
              ? `With ${totalHours.toFixed(1)} total hours logged and a productivity score of ${productivityScore}, ${burnoutRisk === 'Low' ? 'you are maintaining a solid balance. Keep it up!' : 'consider scheduling intentional breaks to avoid burnout.'}`
              : 'Start logging your daily activity to receive personalized AI productivity insights based on your working patterns and focus levels.'}
          </p>
          <button className="btn" onClick={() => navigate('/ai-insights')}>View Detailed Analysis</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
