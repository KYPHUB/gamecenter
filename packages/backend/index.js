const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MemoryStore = require('memorystore')(session);

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: 'gamecenter-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  

// Dummy login (sadece backend test için)
app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  req.session.user = { email };
  res.json({ message: 'Login successful', user: req.session.user });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

app.get('/api/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`✅ Backend API listening at http://localhost:${port}`);
});
