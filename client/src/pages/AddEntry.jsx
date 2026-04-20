import React, { useState } from 'react';
import API_URL from '../config';
import './AddEntry.css';

const AddEntry = ({ user }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    totalHours: '',
    focusHours: '',
    breakTime: '',
    mood: 'Neutral'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Sending data:', formData);

    try {
      if (!user) return alert('No user logged in!');
      const response = await fetch(`${API_URL}/add-entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user,
          date: formData.date,
          totalHours: Number(formData.totalHours),
          focusHours: Number(formData.focusHours),
          breakTime: Number(formData.breakTime),
          mood: formData.mood
        })
      });

      if (response.ok) {
        alert('Entry Added Successfully');
        setFormData({
          date: new Date().toISOString().split('T')[0],
          totalHours: '',
          focusHours: '',
          breakTime: '',
          mood: 'Neutral'
        });
      } else {
        console.error('Failed to add entry');
      }
    } catch (error) {
      console.error('Error sending entry:', error);
    }
  };

  return (
    <div className="add-entry-page">
      <div className="page-header">
        <h1 className="page-title">Add Daily Entry</h1>
        <p className="text-secondary">Log your hours and focus metrics for today.</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-group full-width">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalHours">Total Hours Worked</label>
            <input
              type="number"
              id="totalHours"
              name="totalHours"
              step="0.5"
              min="0"
              max="24"
              value={formData.totalHours}
              onChange={handleChange}
              placeholder="e.g. 8"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="focusHours">Focus Hours</label>
            <input
              type="number"
              id="focusHours"
              name="focusHours"
              step="0.5"
              min="0"
              max="24"
              value={formData.focusHours}
              onChange={handleChange}
              placeholder="e.g. 6.5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="breakTime">Break Time (Minutes)</label>
            <input
              type="number"
              id="breakTime"
              name="breakTime"
              min="0"
              value={formData.breakTime}
              onChange={handleChange}
              placeholder="e.g. 45"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mood">Mental State / Mood</label>
            <select
              id="mood"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
            >
              <option value="Energized">Energized</option>
              <option value="Focused">Focused</option>
              <option value="Neutral">Neutral</option>
              <option value="Tired">Tired</option>
              <option value="Exhausted">Exhausted</option>
            </select>
          </div>

          <button type="submit" className="btn submit-btn full-width">Save Entry</button>
        </form>
      </div>
    </div>
  );
};

export default AddEntry;
