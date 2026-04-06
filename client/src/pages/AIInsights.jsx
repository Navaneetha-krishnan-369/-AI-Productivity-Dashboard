import React, { useState, useEffect } from 'react';
import { BrainCircuit, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';
import './AIInsights.css';

const AIInsights = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/entries')
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Failed to fetch', err));
  }, []);

  const totalEntries = entries.length;
  const totalHours = entries.reduce((acc, curr) => acc + (Number(curr.totalHours) || 0), 0);
  const focusHours = entries.reduce((acc, curr) => acc + (Number(curr.focusHours) || 0), 0);
  const avgProductivity = totalHours > 0 ? Math.round((focusHours / totalHours) * 100) : 0;

  let performanceLevel = "Low";
  if (avgProductivity > 75) performanceLevel = "High performance";
  else if (avgProductivity >= 50) performanceLevel = "Moderate";

  const isBurnoutHigh = totalHours > 8;
  const burnoutRisk = isBurnoutHigh ? "High" : (totalHours > 4 ? "Medium" : "Low");

  return (
    <div className="ai-insights-page">
      <div className="page-header">
        <h1 className="page-title">AI Insights</h1>
        <p className="text-secondary">Machine learning analysis of your work habits.</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-secondary" style={{padding: '2rem'}}>No data available for insights.</p>
      ) : (
        <div className="insights-container">
          <div className="insight-card highlight">
            <div className="insight-icon bg-accent">
              <Lightbulb size={24} color="#ffffff" />
            </div>
            <div className="insight-content">
              <h3>Performance Assessment: {performanceLevel}</h3>
              <p>
                Your average productivity score is {avgProductivity}%. 
                {avgProductivity > 75 ? " Fantastic job keeping a high focus ratio! You are consistently achieving deep work states." : 
                 avgProductivity >= 50 ? " You have a balanced work routine. There is room to optimize your focus hours further." : 
                 " Your focus ratio is below optimal. Consider reducing distractions or breaking tasks into smaller chunks."}
              </p>
            </div>
          </div>

          <div className={`insight-card ${isBurnoutHigh ? 'warning' : 'success'}`}>
            <div className={`insight-icon ${isBurnoutHigh ? 'bg-warning' : 'bg-success'}`}>
              {isBurnoutHigh ? <AlertTriangle size={24} color="#f59e0b" /> : <ShieldCheck size={24} color="#10b981" />}
            </div>
            <div className="insight-content">
              <h3>Burnout Risk: {burnoutRisk}</h3>
              <p>
                You have logged {totalHours.toFixed(1)} total hours. 
                {isBurnoutHigh ? " Warning: Logging excessive hours significantly increases your risk of burnout. Please consider taking regular breaks and scheduling downtime." : 
                 " You are maintaining a sustainable workload. Keep balancing work and rest to prevent long-term fatigue."}
              </p>
            </div>
          </div>

          <div className="insight-card success">
            <div className="insight-icon bg-success">
              <BrainCircuit size={24} color="#10b981" />
            </div>
            <div className="insight-content">
              <h3>Data Summary</h3>
              <p>
                Based on {totalEntries} recorded entries, you have accumulated {focusHours.toFixed(1)} hours of deep focus. 
                Maintaining this tracking habit helps AI give you more precise recommendations over time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
