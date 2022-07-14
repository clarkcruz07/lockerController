const express = require('express');
var cors = require('cors');

// routes
const hardware = require('./routes/api/lockercontroller');

const app = express();

// cors
var corsOptions = {
    origin: "*",
    credentials: true
  };
app.use(cors(corsOptions));

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hardware access API running!'));

app.use('/api/lockercontroller', hardware);

const port = process.env.PORT || 9090;

app.listen(port, () => console.log(`[INFO] API running on port ${port}`));

console.log('[INFO] Hardware API ready');