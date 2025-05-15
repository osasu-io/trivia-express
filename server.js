const express = require('express')
require('dotenv').config();
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

let db;
const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;


app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db(dbName)
    console.log('connected to database')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('trivia').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { trivia: result })
  })
})

app.post('/trivia', (req, res) => {
  db.collection('trivia').insertOne({
    question: req.body.question,
    answer: req.body.answer,
    category: req.body.category,
    difficulty: req.body.difficulty,
    memorized: false
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/memorize', (req, res) => {
  db.collection('trivia').findOneAndUpdate(
    { question: req.body.question },
    { $set: { memorized: true } },
    { sort: { _id: -1 }, upsert: false },
    (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    }
  )
})

app.delete('/trivia', (req, res) => {
  db.collection('trivia').findOneAndDelete(
    { question: req.body.question },
    (err, result) => {
      if (err) return res.send(500, err)
      res.send('Trivia deleted!')
    }
  )
})
