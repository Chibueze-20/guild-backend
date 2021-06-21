const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const routes = require('./routes/routes')

// create express app
const app = express();

// // parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// enable files upload
app.use(fileUpload({
  useTempFiles: true
}));

// // parse requests of content-type - application/json
app.use(express.json())

// database connection
const dbURI = process.env.dbURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false })
  .then((result) => app.listen(3000, () => {
      console.log("Server is listening on port 3000")
  }))
  .catch((err) => console.log(err));

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the Guild"});
});

app.use(routes)

// listen for requests
// app.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// });