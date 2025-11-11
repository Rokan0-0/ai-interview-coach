// In server/passportConfig.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      // --- 1. Get Keys from .env ---
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'import.meta.env.VITE_API_URL/api/auth/google/callback', // Our redirect URI
      scope: ['profile', 'email'], // What we ask Google for
    },
    async (accessToken, refreshToken, profile, done) => {
      // --- 2. This function runs after Google redirects back to us ---
      console.log('--- Google Auth Callback Received ---');
      console.log('Google Profile:', profile);
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;

        console.log('Attempting to find user with Google ID:', googleId);

        // --- 3. Find or Create User ---
        let user = await prisma.user.findUnique({
          where: { googleId: googleId },
        });

        console.log('Found existing user:', user);

        if (!user) {
          // If no user with this Google ID, check if the email is already in use
          const userWithEmail = await prisma.user.findUnique({ where: { email } });

          if (userWithEmail && userWithEmail.provider !== 'google') {
            // User exists but signed up with email.
            // This is an advanced case, for now we'll just link them.
            user = await prisma.user.update({
              where: { email: email },
              data: { googleId: googleId, provider: 'google' },
            });
          } else if (userWithEmail) {
            // This user already exists and used Google.
            user = userWithEmail;
          } else {
            // This is a brand new user
            console.log('No user found. Creating new user with email:', email);
            user = await prisma.user.create({
              data: {
                email: email,
                googleId: googleId,
                provider: 'google',
                password: null, // Google OAuth users don't have passwords
              },
            });
          }
        }
        
        // --- 4. Send user to the next step ---
        // 'done' is a passport function. This attaches the 'user' object to the session.
        console.log('Passport \'done\' function called successfully for user:', user.email);
        return done(null, user);

      } catch (error) {
        console.error('--- PASSPORT STRATEGY ERROR ---', error);
        return done(error, false);
      }
    }
  )
);

// --- These two functions are required by Passport ---

// Saves the user's ID to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieves the user's data from the session using the ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;