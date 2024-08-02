const { Client } = require('pg');

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASS,
  port: process.env.POSTGRES_PORT,
});
console.log('Connecting to database');
client.connect()
  .then(() => console.log('Connected successfully'))
  .catch(e => console.error('Connection error', e.stack))
  .finally(() => client.end());