import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';

import { todoRoutes } from './routes/todos-routers.js';

export const app = express();

app.use(express.static(path.resolve('public'))); // serve everything from public a static
app.use(bodyParser.json()); // use the json parser for the requests
app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
  res.sendFile('/public/index.html', { root: `${__dirname}/public/` });
});
