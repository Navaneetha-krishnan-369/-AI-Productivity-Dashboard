import React, { useState, useEffect, useRef } from 'react';
import API_URL from '../config';
import { BrainCircuit, Lightbulb, AlertTriangle, ShieldCheck, Send, Sparkles } from 'lucide-react';
import './AIInsights.css';

const AIInsights = ({ user }) => {
  const [entries, setEntries] = useState([]);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/entries?username=${user}`)
      .then(res => res.json())
      .then(data => setEntries(data))
      .catch(err => console.error('Failed to fetch', err));
  }, [user]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, message: inputMessage })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I couldn't process that. Please try again." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Network error. Please check your connection.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const totalEntries = entries.length;
  const totalHours = entries.reduce((acc, curr) => acc + (Number(curr.totalHours) || 0), 0);
  const focusHours = entries.reduce((acc, curr) => acc + (Number(curr.focusHours) || 0), 0);
  const breakMinutes = entries.reduce((sum, e) => sum + (Number(e.breakTime) || 0), 0);
  const breakHours = breakMinutes / 60;
  
  const avgProductivity = totalHours > 0 ? Math.round((focusHours / totalHours) * 100) : 0;

  let performanceLevel = "Low";
  if (avgProductivity > 75) performanceLevel = "High performance";
  else if (avgProductivity >= 50) performanceLevel = "Moderate";

  const isNotResting = breakHours < (totalHours * 0.1); 
  const isBurnoutHigh = totalHours > 8 && isNotResting;
  const burnoutRisk = isBurnoutHigh ? "High" : (totalHours > 8 ? "Moderate (Mitigated by breaks)" : (totalHours > 4 ? "Low" : "Minimal"));

  return (
    <div className="ai-insights-page">
      <div className="page-header">
        <h1 className="page-title">AI Insights</h1>
        <p className="text-secondary">Machine learning analysis of your work habits.</p>
      </div>

      {entries.length === 0 ? (
        <p className="text-secondary" style={{ padding: '2rem' }}>No data available for insights.</p>
      ) : (
        <div className="ai-insights-content">
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
                  You have logged {totalHours.toFixed(1)} total hours and {breakHours.toFixed(1)} hours of rest.
                  {isBurnoutHigh ? " Warning: Logging excessive hours without adequate breaks significantly increases your risk of burnout. Try adopting the Pomodoro technique to force short rest intervals." :
                    isNotResting ? " Note: Your workload is manageable, but you aren't taking many breaks. Incorporate more rest as your hours increase." :
                    " Great job taking intentional breaks! This allows you to work longer and maintain deep states without accumulating fatigue."}
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

          <div className="chat-container">
            <div className="chat-header">
              <Sparkles size={20} className="text-accent" />
              <h2>Ask Your AI Assistant</h2>
            </div>
            
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <BrainCircuit size={48} className="text-secondary opacity-50 mb-3" />
                  <p>Ask anything about your productivity trends, how to improve focus, or avoid burnout.</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.role}`}>
                    <div className="message-bubble">
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="chat-message model">
                  <div className="message-bubble typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                placeholder="Message your AI Assistant..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" disabled={!inputMessage.trim() || isTyping}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
