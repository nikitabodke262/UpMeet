const Test = require('./models/test');

const mongoose = require('mongoose');
const { getMaxListeners } = require('process');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("yes")
    })
    .catch((e) => {
        console.log("Error found!");
        console.log(e);
    })

const p = new Test({
    email: 'aryan@gmail.com',
    password: '12345'
})

p.save()
    .then(p => {
        console.log(p);
    })
    .catch(e => {
        console.log(e);
    })