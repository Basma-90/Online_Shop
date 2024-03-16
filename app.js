const express = require('express');
const path = require('path');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
require('dotenv').config();

const { dbConnct } = require('./config/dbConfig');
const homeRouter = require('./routes/home.route');
const productRouter = require('./routes/product.route');
const authRouter = require('./routes/auth.route');

const app = express();

// Set up the view engine and static files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));


// Set up the session
const store = new sessionStore({
    uri: process.env.DATABASE_URI,
    collection: 'sessions'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));

// Set up flash messages
app.use(flash());

// Connect to the database
dbConnct();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', homeRouter);
app.use('/product', productRouter);
app.use(authRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
