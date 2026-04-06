import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Target, Activity, Zap, TrendingUp } from 'lucide-react';
import './Analytics.css';

const Analytics = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('https://ai-productivity-dashboard-production-4e1e.up.railway.app/entries')
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Failed to fetch', err));
  }, []);

  const totalEntries = entries.length;
  const totalHours = entries.reduce((acc, curr) => acc + (Number(curr.totalHours) || 0), 0);
  const focusHours = entries.reduce((acc, curr) => acc + (Number(curr.focusHours) || 0), 0);
  const avgProductivity = totalHours > 0 ? Math.round((focusHours / totalHours) * 100) : 0;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="text-secondary">Deep dive into your productivity patterns.</p>
      </div>

      <div className="stats-grid">
        <Card title="Total Entries" value={totalEntries} subtitle="All recorded logs" icon={<Target size={24} />} />
        <Card title="Avg Productivity" value={`${avgProductivity}%`} subtitle="Focus / Total Hours" icon={<Zap size={24} />} />
        <Card title="Total Hours" value={`${totalHours.toFixed(1)}h`} subtitle="Cumulative time" icon={<Activity size={24} />} />
        <Card title="Focus Hours" value={`${focusHours.toFixed(1)}h`} subtitle="Deep work time" icon={<TrendingUp size={24} color="var(--success-color)" />} />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="section-title">Productivity Trend (Recent)</h3>
          <div className="distribution-bars">
            {entries.length > 0 ? entries.slice().reverse().slice(0, 5).map((entry, idx) => {
              const score = Number(entry.totalHours) > 0 ? Math.round((Number(entry.focusHours) / Number(entry.totalHours)) * 100) : 0;
              const dateLabel = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div className="dist-row" key={entry._id || idx}>
                  <span className="dist-label">{dateLabel}</span>
                  <div className="dist-bar-bg"><div className="dist-bar-fill" style={{ width: `${score}%` }}></div></div>
                  <span className="dist-value">{score}%</span>
                </div>
              );
            }) : <p className="text-secondary">No data available to show trends.</p>}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="section-title">Overview Metrics</h3>
          <div className="progress-circles">
            <div className="circle-item">
              <div className="circle" style={{ background: `conic-gradient(var(--accent-color) ${avgProductivity}%, var(--bg-color) 0)` }}>
                <span>{avgProductivity}%</span>
              </div>
              <p>Avg Focus</p>
            </div>
            <div className="circle-item">
              <div className="circle" style={{ background: `conic-gradient(var(--success-color) ${Math.min((totalHours / 100) * 100, 100)}%, var(--bg-color) 0)` }}>
                <span>{totalHours.toFixed(1)}h</span>
              </div>
              <p>Total Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
