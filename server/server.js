const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config({ path: path.join(__dirname, '.env') })

// Read users data file
const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.txt'), 'utf8'))

// Express back-end
const app = express();
app.use(bodyParser.json())
app.use(cookieParser())

// React front-end
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// API
app.post('/api/authenticate', (req, res) => {
  const { username, password } = req.body;

  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      res.cookie('id', users[i].id)
      res.status(200)
      return res.send(users[i])
    }
  }

  return res.sendStatus(404)
})

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  users.push({
    id: users.length + 1,
    username: username,
    password: password,
    songs: []
  })
  fs.writeFileSync(path.join(__dirname, 'data.txt'), JSON.stringify(users))

  return res.sendStatus(200)
})

app.post('/api/songs/add', (req, res) => {
  const { song } = req.body;

  let songsTemp = [];
  songsTemp.push(song)
  songsTemp.push(...users[req.cookies.id - 1].songs)
  users[req.cookies.id - 1].songs = songsTemp
  fs.writeFileSync(path.join(__dirname, 'data.txt'), JSON.stringify(users))

  res.status(200)
  res.send(users[req.cookies.id - 1])
})

app.post('/api/songs/delete', (req, res) => {
  const { songTitle } = req.body;

  for (var i = 0; i < users[req.cookies.id - 1].songs.length; i++) {
    if (songTitle === users[req.cookies.id - 1].songs[i].title) {
      users[req.cookies.id - 1].songs.splice(i, 1)
    }
  }
  fs.writeFileSync(path.join(__dirname, 'data.txt'), JSON.stringify(users))

  res.status(200)
  res.send(users[req.cookies.id - 1])
})

// Serve
app.listen(process.env.APP_PORT, () => {
  console.log("Server listening on port " + process.env.APP_PORT)
})