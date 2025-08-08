// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const coachesRoute = require('./src/routes/coaches');
const unlocksRoute = require('./src/routes/unlocks');
const userRoute = require('./src/routes/user');
const errorHandler = require('./src/middlewares/errorHandler');

app.use('/api/coaches', coachesRoute);
app.use('/api/unlock', unlocksRoute);
app.use('/api/user', userRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
