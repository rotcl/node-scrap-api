const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const apicache = require('apicache');
const compression = require('compression');
const Scraper = require('./services/Scraper');

const PORT = 4001;

const app = express();
const cache = apicache.middleware;
app.use(cors())
app.use(compression());
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/casos', cache('1 hour'), async (req, res) => {
  const scraper = new Scraper();
  const data = await scraper.fetchTimeSeries();
  return res.json(data);
});

app.get('/timeline', cache('5 hours'), async (req, res) => {
  const scraper = new Scraper();
  const data = await scraper.getTimeline();
  return res.json(data);
});

app.get('*', (req, res) => res.send('Estoy atrapado en una fábrica china, tengo sospechas de virus, ayuda'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
