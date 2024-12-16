const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User'); // Your User model
const axios = require('axios');

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const { email, name, picture } = profile._json;

            // Find or Create User
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ email, name, profilePicture: picture, provider: 'google' });
            }
            done(null, user);
        }
    )
);

// GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: '/api/auth/github/callback',
            scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            let email = null;

            // If emails field is undefined, fetch it from the GitHub API
            if (profile.emails && profile.emails.length > 0) {
                email = profile.emails[0].value;
            } else {
                const { data } = await axios.get('https://api.github.com/user/emails', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const primaryEmail = data.find((emailObj) => emailObj.primary);
                email = primaryEmail ? primaryEmail.email : null;
            }

            if (!email) {
                return done(new Error('Email not available in GitHub profile'));
            }

            const name = profile.displayName || profile.username;

            // Find or Create User
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ email, name, provider: 'github' });
            }
            done(null, user);
        }
    )
);

// // Facebook Strategy
// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_CLIENT_ID,
//             clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//             callbackURL: '/api/auth/facebook/callback',
//             profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
//         },
//         async (accessToken, refreshToken, profile, done) => {
//             const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
//             const name = `${profile.name.givenName} ${profile.name.familyName}`;
//             const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

//             if (!email) {
//                 return done(new Error('Email not available in Facebook profile'));
//             }

//             // Find or Create User
//             let user = await User.findOne({ email });
//             if (!user) {
//                 user = await User.create({ email, name, profilePicture: picture, provider: 'facebook' });
//             }
//             done(null, user);
//         }
//     )
// );

// LinkedIn Strategy
passport.use(
    new LinkedInStrategy(
        {
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: '/api/auth/linkedin/callback',
            scope: ['r_emailaddress', 'r_liteprofile'],
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            const name = profile.displayName;
            const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

            if (!email) {
                return done(new Error('Email not available in LinkedIn profile'));
            }

            // Find or Create User
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ email, name, profilePicture: picture, provider: 'linkedin' });
            }
            done(null, user);
        }
    )
);

module.exports = passport;
