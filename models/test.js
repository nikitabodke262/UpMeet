const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

const Test = mongoose.model('Test',testSchema); 

module.exports =  Test;