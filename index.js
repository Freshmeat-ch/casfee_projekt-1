import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// load app with current config
const app = (await import('./app.js')).app;

const hostname = '127.0.0.1';
const port = 3001;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
