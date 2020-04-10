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
```

Follow the next steps to run the app locally:

1. Create a `.env` text file in the `server` folder with the following lines:

```
APP_PORT = 4000
```
2. Build and initialize the app in the `client` folder by running these commands:
```
cd app
npm run build
mv build ../../server
cd ../../server
npm start
```

> Logo source: https://undraw.co/