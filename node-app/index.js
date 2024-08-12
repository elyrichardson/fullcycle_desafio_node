const express = require('express');
const mysql = require('mysql');
const faker = require('faker');

const app = express();
const port = 3000;

const config = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'fullcycle'
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.get('/', (req, res) => {
  const nameFaker = faker.name.findName();
  const insertQuery = `INSERT INTO people(name) values('${nameFaker}')`;
  connection.query(insertQuery, (err) => {
      if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send('Error inserting data');
      }

      connection.query(`SELECT name FROM people`, (err, results) => {
          if (err) {
              console.error('Error fetching data:', err);
              return res.status(500).send('Error fetching data');
          }

          let response = '<h1>Full Cycle Rocks!</h1>';
          response += '<ul>';
          results.forEach(row => {
              response += `<li>${row.name}</li>`;
          });
          response += '</ul>';

          res.send(response);
      });
  });
});


app.listen(port, () => {
  console.log(`Node app listening at http://localhost:${port}`);
});

