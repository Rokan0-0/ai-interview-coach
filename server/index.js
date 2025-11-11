// --- CONFIG IMPORTS ---
import jwt from 'jsonwebtoken';
import session from 'express-session';
import passport from './passportConfig.js';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'; // This is our database connection
import bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protect } from './middleware/authMiddleware.js';
import { adminProtect } from './middleware/adminMiddleware.js';

// --- CONFIG EXECUTION ---
dotenv.config(); // This loads our .env file!
const prisma = new PrismaClient();

// --- INITIALIZE AI CLIENT ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// --- APP SETUP ---
const app = express();

// Define a port for our server to run on
const PORT = 5000;

// This tells Express to allow requests from other origins
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
})); 

// This tells Express to automatically parse JSON in request bodies
app.use(express.json());

// --- Session & Passport Middleware (MUST be before API routes) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a_default_secret_for_development', // Use an environment variable
    resave: false,
    saveUninitialized: false,
  })
);

// --- Initialize Passport and its session management ---
app.use(passport.initialize());
app.use(passport.session());

// --- PUBLIC ROUTES ---

// Create a simple "GET" route for the root URL
// This is what someone sees if they just visit http://localhost:5000
app.get('/', (req, res) => {
  // Send a JSON response that the client expects
  // The client is looking for an object with a 'message' key
  res.json({ message: 'Hello World! This is the interview-coach server.' });
});

// Start the server and make it listen for requests on the defined port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// --- NEW USER REGISTRATION ROUTE ---
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input (basic)
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 4. Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    // 5. Respond with success (don't send the password back!)
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- USER LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      // Use a generic error for security (don't reveal if email exists)
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 3. Check if user has a password (OAuth users don't have passwords)
    if (!user.password) {
      return res.status(401).json({ error: 'This account was created with Google. Please sign in with Google.' });
    }

    // 4. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // 5. User is valid! Create a JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // This is the data "payload" in the token
      process.env.JWT_SECRET,                  // The secret key from our .env file
      { expiresIn: '1h' }                       // The token will expire in 1 hour
    );

    // 6. Send the token back to the client
    res.status(200).json({
      message: 'Login successful',
      token: token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- GOOGLE AUTH ROUTES ---

// 1. The route the user clicks. It redirects them to Google's login page.
app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. The route Google redirects back to (our "callback URI").
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }), // We use JWT, so session is false
  (req, res) => {
    // --- 3. Google auth was successful! User is on req.user ---
    // We now create *our* JWT token, just like in normal login.
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // --- 4. Redirect user back to the *frontend* with the token ---
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

// --- PROTECTED TEST ROUTE ---
app.get('/api/protected-test', protect, (req, res) => {
  // If the request gets here, it means the 'protect' middleware passed.
  // We have access to the user data we attached in the middleware!
  res.status(200).json({
    message: `Hello, ${req.user.email}! You are accessing a protected route.`,
    user: req.user,
  });
});

// --- PROTECTED API ROUTES ---

// --- GET CURRENT USER INFO ---
app.get('/api/users/me', protect, async (req, res) => {
  try {
    // Get the user's ID from the protect middleware
    const userId = req.user.id;
    // Fetch the full user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Select only the data we need to send
      select: {
        id: true,
        email: true,
        createdAt: true,
        provider: true,
        apiCallCount: true,
        lastApiCallDate: true
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Send the user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- GET ALL JOB TRACKS ---
app.get('/api/tracks', protect, async (req, res) => {
  try {
    const tracks = await prisma.jobTrack.findMany();
    res.status(200).json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- GET ALL QUESTIONS FOR A SPECIFIC TRACK ---
app.get('/api/tracks/:trackId/questions', protect, async (req, res) => {
  try {
    const { trackId } = req.params;
    const questions = await prisma.question.findMany({
      where: {
        jobTrackId: parseInt(trackId),
      },
      select: {
        id: true,
        text: true, // Only send the ID and text
      },
    });

    if (questions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this track.' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- SUBMIT ANSWER & GET AI FEEDBACK ---
app.post('/api/answer', protect, async (req, res) => {
  try {
    const { questionId, answerText } = req.body;
    const userId = req.user.id; // From our 'protect' middleware

    // Get the full user from the database
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    // Rate limiting logic
    const today = new Date().setHours(0, 0, 0, 0);
    const lastCall = user.lastApiCallDate.setHours(0, 0, 0, 0);
    let currentCount = user.apiCallCount;
    // 1. Check if it's a new day
    if (today > lastCall) {
      currentCount = 0; // Reset the count
    }
    // 2. Check the limit
    if (currentCount >= 5) {
      // User is over their limit
      return res.status(429).json({ error: 'You have exceeded your daily limit of 5 feedback requests.' });
    }

    // 1. Validate input
    if (!questionId || !answerText) {
      return res.status(400).json({ error: 'Question ID and answer text are required.' });
    }

    // 2. Get the original question text from our DB
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { jobTrack: true }, // Include the job track info
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // 3. --- THE AI PROMPT ---
    // This is the prompt we designed, now with our real data
    const prompt = `You are an expert AI Interview Coach named 'Mentor'. You are role-playing as a senior hiring manager for a '${question.jobTrack.name}' position. You are professional, constructive, and aim to help the candidate improve.

    The interview question was:
    "${question.text}"

    The user's answer is:
    "${answerText}"

    Your Task:
    Provide feedback on their answer. Format your response *only* as a JSON object with two keys: "rating" (a numerical score from 1 to 5) and "feedback" (an array of 3-4 strings).

    Example JSON format:
    {
      "rating": 3,
      "feedback": [
        "Good use of the STAR method to structure your answer.",
        "The 'Result' part of your answer was a bit vague. Try to include a specific metric or outcome.",
        "Your tone is professional and confident."
      ]
    }
    
    Analyze the answer for structure, clarity, and impact. Be specific. Always include at least one "what to improve" bullet point. Keep feedback concise.`;

    // 4. Call the AI
    if (!aiModel) {
      throw new Error('AI model not initialized yet');
    }
    const result = await aiModel.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text(); // Renamed for clarity

    // --- NEW: Clean the AI's response ---
    // Use a regular expression to find the JSON block
    const match = aiResponseText.match(/\{[\s\S]*\}/);

    if (!match) {
      // If the AI didn't return JSON at all
      console.error('AI response was not valid JSON:', aiResponseText);
      return res.status(500).json({ error: 'AI did not return valid feedback.' });
    }
    
    const cleanJsonString = match[0]; // This is just the "{...}" part
    // ------------------------------------

    // Update user's count and last call date
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        apiCallCount: currentCount + 1,
        lastApiCallDate: new Date()
      }
    });

    // 5. Save the answer and the AI's feedback to *our* database
    await prisma.answer.create({
      data: {
        answerText: answerText,
        feedback: cleanJsonString, // <-- Save the CLEAN JSON string
        userId: userId,
        questionId: questionId,
      },
    });

    // 6. Send the AI feedback (as a JSON object) back to the client
    res.status(200).json(JSON.parse(cleanJsonString));

  } catch (error) {
    console.error('AI feedback error:', error);
    res.status(500).json({ error: 'Failed to get AI feedback.' });
  }
});

// --- GET USER'S ANSWER HISTORY ---
app.get('/api/answers/my-history', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const answers = await prisma.answer.findMany({
      where: { userId: userId },
      // Also include the original question text
      include: {
        question: {
          select: { text: true }
        }
      },
      orderBy: {
        createdAt: 'desc' // Show most recent first
      }
    });
    res.status(200).json(answers);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- ADMIN ROUTES ---
// Get all questions
app.get('/api/admin/questions', protect, adminProtect, async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: { jobTrack: true }
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
});

// Create a new question
app.post('/api/admin/questions', protect, adminProtect, async (req, res) => {
  try {
    const { text, jobTrackId } = req.body;
    const newQuestion = await prisma.question.create({
      data: {
        text: text,
        jobTrackId: parseInt(jobTrackId)
      }
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question.' });
  }
});

// Delete a question
app.delete('/api/admin/questions/:id', protect, adminProtect, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.question.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question.' });
  }
});