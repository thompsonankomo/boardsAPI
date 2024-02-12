const express = require('express');
const mongodb = require('./db/database');
const passport = require('passport');
const bodyparser = require('body-parser');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyparser.json())
    .use(
        session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        })
    )
    .use(passport.initialize())
    .use(passport.session())
    .use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"] }))
    .use(cors({ origin: "*" }));

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);

passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});


// Middleware for handling CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use('/', require('./routes'));
// Middleware for parsing request body as JSON
app.use(express.json());

// Routes
app.get('/', (req, res) => (res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged Out')));
app.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/api-docs", session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect("/");
    });


// Error handling for unhandled exceptions
process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Handle the error appropriately
});

// Initialize MongoDB connection
mongodb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
        // Start the server after successful MongoDB connection
        app.listen(port, () => {
            console.log(`Connected to DB and Running on port ${port}`);
        });
    }
});
