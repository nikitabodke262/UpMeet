const express = require('express');
const app = express();
const path = require('path');

const Test = require('./models/test');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("yes")
    })
    .catch((e) => {
        console.log("Error found!");
        console.log(e);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"))

app.get('/tests', async (req, res) => {
    const tests = await Test.find({})
    console.log(tests);
    res.send("wppf!");
})

app.get('/home', async (req, res) => {
    console.log('homepage');
    res.render('index')
})

app.post('/bits', (req, res) => {
    console.log(req.body);
    res.send('makin ur body');
})

app.listen(3000, () => {
    console.log("App is listening on port 3000!");
})