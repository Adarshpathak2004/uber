const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
// allow credentials so cookies can be sent from clients (browsers)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // parse application/json
app.use(cookieParser());

// Connect to DB
const connectToDb = require('./db/db');
connectToDb();

// Mount routes
const captainRoutes = require('./routes/captain.route');
const userRoutes = require('./routes/user.routes');
app.use('/captain', captainRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = app;