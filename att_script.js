const csv = require('csv-parser');
const fs = require('fs');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(
    "mongodb+srv://wimpywarlord:warlord123@cluster0-fzp9u.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "goodmorningGirlfriend",
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
    email: String,
    phone: String,
    question: String,
});

var user = mongoose.model("user", userSchema);



entires = []

fs.createReadStream('boom1.csv')
  .pipe(csv())
  .on('data', (row) => {
    // console.log(row)
    entires.push(row)
  })
  .on('end', () => {
    console.log(entires)
    // entires.forEach(element => {
        
    // });  
    

// write to a new file named 2pac.txt
fs.writeFile('2pac.txt', lyrics, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('Lyric saved!');
});
    console.log('CSV file successfully processed');
  });


