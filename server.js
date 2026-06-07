const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDB = require('./connect/database');
const { errorHandler } = require('./middleware/errorMiddleware');

connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users',        require('./routes/userRoutes'));
app.use('/api/projects',     require('./routes/projectRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`TalentAL Server aktiv në port ${port}`));
