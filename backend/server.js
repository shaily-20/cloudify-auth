require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const { verifyToken, JWT_SECRET } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:3007'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize Google OAuth client with the client ID
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  redirectUri: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:3006",
    "http://localhost:3007"
  ]
});

// Fake users database (instead of MongoDB)
const users = [];

// Helper function to find user
const findUser = (username) => users.find(u => u.username === username);

// Helper function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// **Sign Up Route**
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username already exists
    if (findUser(username)) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      refreshToken: null,
      createdAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);

    // Generate tokens for automatic login
    const { accessToken, refreshToken } = generateTokens(newUser.id);
    newUser.refreshToken = refreshToken;

    // Set cookies
    res.cookie('token', accessToken, { 
      httpOnly: true, 
      secure: false, // set to true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000 // 1 hour
    });
    
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: false, // set to true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 604800000 // 7 days
    });

    res.status(201).json({ 
      message: "User created successfully!",
      user: { 
        id: newUser.id, 
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = findUser(username);

    if (!user) {
      return res.status(401).json({ 
        message: "User not found. Please sign up!", 
        isNewUser: true 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password!" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    user.refreshToken = refreshToken;

    // Set cookies
    res.cookie('token', accessToken, { 
      httpOnly: true, 
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000 
    });
    
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 604800000
    });

    res.json({ 
      message: "Login successful!",
      user: { 
        id: user.id, 
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

// **Refresh Token Route**
app.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    
    // Update refresh token
    user.refreshToken = newRefreshToken;

    // Set new cookies
    res.cookie('token', accessToken, { 
      httpOnly: true, 
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000 
    });
    
    res.cookie('refreshToken', newRefreshToken, { 
      httpOnly: true, 
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 604800000
    });

    res.json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// **Logout Route**
app.post("/logout", (req, res) => {
  // Find user and invalidate refresh token
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const user = users.find(u => u.refreshToken === refreshToken);
    if (user) {
      user.refreshToken = null;
    }
  }

  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ message: "Logged out successfully!" });
});

// **Check Auth Status Route**
app.get("/check-auth", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  
  res.json({ 
    isAuthenticated: true, 
    user: { id: user.id, username: user.username }
  });
});

// **Protected Route Example**
app.get("/protected", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  res.json({ 
    message: "Protected Data Accessed!", 
    user: { id: user.id, username: user.username }
  });
});

// **Google Authentication Route**
app.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Received token:", token);
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    console.log("Google payload:", payload);
    
    if (!payload) {
      throw new Error("Invalid token payload");
    }

    // Check if user exists
    let user = users.find(u => u.email === payload.email);
    
    if (!user) {
      // Create new user from Google data
      user = {
        id: users.length + 1,
        username: payload.name,
        email: payload.email,
        picture: payload.picture,
        googleId: payload.sub,
        refreshToken: null
      };
      users.push(user);
      console.log("Created new user:", user);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    user.refreshToken = refreshToken;

    // Set cookies with proper configuration
    res.cookie('token', accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600000 // 1 hour
    });
    
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 604800000 // 7 days
    });

    console.log("Authentication successful, sending response");
    res.json({ 
      message: "Google login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ 
      message: "Google authentication failed: " + error.message 
    });
  }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
