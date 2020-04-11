# lyrics

A web app for syncing text to music based on `express` (server) and `react` (client). The following commands have been used to build the app skeleton:

* Client
```
npx create-react-app app
cd app
rm -rf .git
npm install react-router-dom
npm start
```
* Server
```
npm init --yes
npm install dotenv
npm install express
npm install cookie-parser
npm install @mysql/xdevapi
npm install bcryptjs
```

All data is stored in a MySQL database and passwords are hashed by using `bcryptjs`. Use the statements from the `lyrics.sql` file (`server` folder) with the help of a MySQL client to create the appropiate tables and load the sample data:

* Users

| Column | Properties |
| ------ | ---------- |
| username | VARCHAR(30) NOT NULL |
| password | VARCHAR(60) NOT NULL |
| user_id | INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY |

* Songs

| Column | Properties |
| ------ | ---------- |
| title | VARCHAR(50) NOT NULL |
| author | VARCHAR(20) NOT NULL |
| song_lines | JSON NOT NULL |
| user_id | INT UNSIGNED NOT NULL |
| song_id | INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY |

Follow the next steps to run the app locally:

1. Create a `.env` text file in the `server` folder with the following lines (example values):

```
APP_PORT = 4000
DB_HOST = localhost
DB_USER = username
DB_PASSWORD = P@ssw0rd
```
2. Build and initialize the app in the `client` folder by running these commands:
```
cd app
npm install
npm run build
mv build ../../server
cd ../../server
npm install
npm start
```

> Logo source: https://undraw.co/