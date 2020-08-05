const csv = require('csv-parser');
const fs = require('fs');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const { resolve } = require('path');
const { rejects } = require('assert');


mongoose.connect(
    "mongodb+srv://wimpywarlord:qwerty123@cluster0.pyazn.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "stats_viit",
    },
    function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("CONNECTED");
        }
    }
);

var userSchema = new mongoose.Schema({
    Name: String,
    present: Number,
    total: Number,
});

var user = mongoose.model("user", userSchema);

let db_users=[]
let csv_users=[]

const fetching_process = new Promise((resolve,reject) => {

    user.find({}).then((response) => {
        db_users = response; 
    })    
    
    fs.createReadStream('boom1.csv')
    .pipe(csv())
    .on('data', (row) => {
        csv_users.push(row)
    })
    .on('end', () => { 
        console.log('CSV file successfully processed');
    });

    console.log(db_users.length)
    console.log(csv_users.length)

    if (db_users.length!=0 && csv_users.length!=0)
    {
        resolve("Fetching Done");
    }
    else{
        reject("Fetching Failed")
    }
})

setTimeout(() => {
    console.log(db_users)
}, 4000);


// fetching_process.then((message) => {
//     console.log(message)
// }).catch((message) => {
//     console.log(message)
// })



