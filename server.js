const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config/database.js');

let db;

MongoClient.connect(config.url, { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  db = client.db(config.dbName);
  console.log(`Connected to ${config.dbName}`);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  fetch('https://opentdb.com/api.php?amount=1')
    .then(response => response.json())
    .then(triviaData => {
      const trivia = triviaData.results && triviaData.results.length > 0
        ? triviaData.results[0]
        : { category: 'Unknown', question: 'No trivia found.', correct_answer: 'N/A' };

      db.collection('favorites').find().toArray((err, saved) => {
        if (err) return console.error(err);
        res.render('index.ejs', {
          trivia,
          saved
        });
      });
    })
    .catch(err => {
      console.error('API fetch failed:', err);
      res.render('index.ejs', {
        trivia: { category: 'Error', question: 'Could not load trivia.', correct_answer: 'N/A' },
        saved: []
      });
    });
});

app.post('/favorites', (req, res) => {
  db.collection('favorites').insertOne({
    question: req.body.question,
    correct: req.body.correct,
    category: req.body.category,
    memorized: false
  }, (err, result) => {
    if (err) return console.log(err);
    res.json({ success: true });
  });
});

app.put('/memorize', (req, res) => {
  db.collection('favorites').updateOne(
    { question: req.body.question },
    { $set: { memorized: true } },
    (err, result) => {
      if (err) return res.send(err);
      res.json('Marked as memorized');
    }
  );
});

app.delete('/favorites', (req, res) => {
  db.collection('favorites').deleteOne({ question: req.body.question }, (err, result) => {
    if (err) return res.send(500, err);
    res.json('Deleted');
  });
});

app.listen(3000, () => console.log('Server running on 3000'));