const connectToMongo = require('./db');
const express = require('express');

connectToMongo();
const app = express()
const port = 5000

//to use req.body through which we can send data we need to include this middleware
app.use(express.json());

//Availabe Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})