import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') || origin === 'https://ai-productivity-dashboard-one.vercel.app') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema and Model
const entrySchema = new mongoose.Schema({
  username: { type: String, required: true },
  date: { type: String, required: true },
  totalHours: { type: Number, required: true },
  focusHours: { type: Number, required: true },
  breakTime: { type: Number, required: true },
  mood: { type: String, required: true }
});

const Entry = mongoose.model('Entry', entrySchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Routes
// Authentication
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Fetch all entries
app.get('/entries', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  try {
    const entries = await Entry.find({ username }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries', error: error.message });
  }
});

// Add new entry
app.post('/add-entry', async (req, res) => {
  console.log('Incoming Data:', req.body);
  try {
    const newEntry = new Entry({
      username: req.body.username,
      date: req.body.date,
      totalHours: Number(req.body.totalHours),
      focusHours: Number(req.body.focusHours),
      breakTime: Number(req.body.breakTime),
      mood: req.body.mood
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error('Error saving entry:', error);
    res.status(500).json({ message: 'Error saving entry', error: error.message });
  }
});

// AI Chat functionality
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

app.post('/chat', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ message: 'AI is not configured on the server.' });
  }

  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).json({ message: 'Username and message are required' });
  }

  try {
    const entries = await Entry.find({ username }).sort({ date: -1 }).limit(10);

    const contextPrompt = `You are an AI productivity assistant for an app called AI-Productivity-Dashboard.
User: ${username}
Recent productivity entries (last 10 days):
${entries.map(e => `- Date: ${e.date}, Total Hours: ${e.totalHours}, Focus Hours: ${e.focusHours}, Break: ${e.breakTime} mins, Mood: ${e.mood}`).join('\n')}

Based on this data and the user's prompt, provide a concise, helpful, and encouraging response about their productivity, burnout risk, and focus habits. Be brief and engaging. Answer the following user message:
User Message: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
    });

    res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing chat', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
