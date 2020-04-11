const mysqlx = require('@mysql/xdevapi')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: path.join(__dirname, '.env') })

// Connect to database
var session;
mysqlx.getSession({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})
  .then((s) => {
    session = s
    session.sql("USE lyrics;").execute().then(() => {
      console.log("Connected to database on host " + process.env.DB_HOST)
    })
  })

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

  var authenticatedUser = {};
  session.sql("SELECT user_id, username, password FROM users WHERE username = ?")
    .bind(username)
    .execute()
    .then(users => {
      if (user = users.fetchOne()) {
        if (!bcrypt.compareSync(password, user[2])) {
          return res.sendStatus(404)
        }
        authenticatedUser.username = user[1]
        authenticatedUser.songs = []
        session.sql("SELECT title, author, song_lines FROM songs WHERE user_id = ?")
          .bind(user[0])
          .execute()
          .then(songs => {
            while (song = songs.fetchOne()) {
              authenticatedUser.songs.push({
                title: song[0],
                author: song[1],
                lyrics: song[2].lyrics,
                timeStamps: song[2].timeStamps
              })
            }
            res.cookie('id', user[0])
            res.status(200)
            return res.send(authenticatedUser)
          })
      } else {
        return res.sendStatus(404)
      }
    })
})

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  session.sql("SELECT COUNT(*) FROM users WHERE users.username = ?")
    .bind(username)
    .execute()
    .then((usersCount) => {
      if (usersCount.fetchOne() == 0) {
        session.sql("INSERT INTO users VALUES(?,?,NULL)")
          .bind(username, bcrypt.hashSync(password))
          .execute()
          .then(() => {
            return res.sendStatus(200)
          })
      } else {
        return res.sendStatus(404)
      }
    })
})

app.post('/api/songs/add', (req, res) => {
  const { song } = req.body;

  session.sql("INSERT INTO songs VALUES(?,?,?,?,NULL);")
    .bind(song.title, song.author, JSON.stringify({ "lyrics": song.lyrics, "timeStamps": song.timeStamps }), req.cookies.id)
    .execute()
    .then(() => {
      sendUser(req.cookies.id, res)
    })
})

app.post('/api/songs/delete', (req, res) => {
  const { songTitle } = req.body;

  session.sql("DELETE FROM songs WHERE songs.user_id = ? AND songs.title = ?")
    .bind(req.cookies.id, songTitle)
    .execute()
    .then(() => {
      sendUser(req.cookies.id, res)
    })
})

// Serve
app.listen(process.env.APP_PORT, () => {
  console.log("Server listening on port " + process.env.APP_PORT)
})

function sendUser(userId, res) {
  var authenticatedUser = {}

  session.sql("SELECT username FROM users WHERE user_id = ?")
    .bind(userId)
    .execute()
    .then(users => {
      if (user = users.fetchOne()) {
        authenticatedUser.username = user[0]
        authenticatedUser.songs = []
        session.sql("SELECT title, author, song_lines FROM songs WHERE user_id = ?")
          .bind(userId)
          .execute()
          .then(songs => {
            while (song = songs.fetchOne()) {
              authenticatedUser.songs.push({
                title: song[0],
                author: song[1],
                lyrics: song[2].lyrics,
                timeStamps: song[2].timeStamps
              })
            }
            return res.send(authenticatedUser)
          })
      } else {
        return res.sendStatus(404)
      }
    })
}