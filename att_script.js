const csv = require('csv-parser');
const fs = require('fs');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


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

entires = []

fs.createReadStream('boom1.csv')
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row)
    entires.push(row);
    user.create(
        {
            Name: row["Full Name"],
            present: 1,
            total: 1,
        },
        function (err, yolo) {
            if (err) {
                console.log("DATA IS NOT PUSHED");
            } else {
                console.log("DATA HAS BEEN PUSHED");
            }
        }
    );
  })
  .on('end', () => {
    console.log(entires)
    // entires.forEach(element => {
        
    // });  
    console.log('CSV file successfully processed');
  });


