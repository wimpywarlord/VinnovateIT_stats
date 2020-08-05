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

            var userSchema = new mongoose.Schema({
                Name: String,
                present: Number,
            });
            
            var user = mongoose.model("user", userSchema);
            
            let db_users=[]
            let csv_users=[]
            
            
            
            let promise_read_csv = new Promise((resolve,reject) => {
                fs.createReadStream('boom1.csv')
                .pipe(csv())
                .on('data',  (row) => {
                    // console.log(row)
                    csv_users.push(row)
                    // console.log("**")
                })
                .on('end',  () => { 
                    // console.log('CSV file successfully processed');
                    resolve(("reading csv done"));
                });
            }) 
            
            
            const fetching_process = new Promise( async (resolve,reject) => {
            
                await user.find({}).then((response) => {
                    db_users = response; 
                    // console.log("THIS IS FETCHING FROM SERVER SHOULD BE DONE BEFORE SHOWING LENGTH")
                })    
                
                await promise_read_csv.then((message)=> {
                    // console.log("THIS IS READING OF CSV SHOULD BE DONE BEFORE SHOWING LENGTH")
                    // console.log(csv_users);
                });
            
                console.log(db_users.length)
                console.log(csv_users.length)
            
                if (csv_users.length!=0)
                {
                    resolve("Fetching Done");
                }
                else{
                    reject("Fetching Failed")
                }
            })
            
            
            fetching_process.then((message) => {
                console.log(message)
                // console.log(db_users.length)
                // console.log(csv_users.length)
            
                let csv_list_only_names = []
                csv_users.forEach(element => {
                    // console.log(element["Full Name"])
                    csv_list_only_names.push(element["Full Name"]);
                });
            
                // console.log(csv_list_only_names)
            
                let clean_csv_list= [...new Set(csv_list_only_names)];
            
                // console.log(clean_csv_list)
            
                clean_csv_list.forEach(element => {
                    console.log(element)
                    user.find({ Name: element},  function (err, docs) {
                        if (err) {
                            console.log(err)
                        } else {
                            if (docs.length == 0) {
                                user.create(
                                    {
                                        Name: element,
                                        present: 1,
                                        total: 1,
                                    },
                                    function (err, yolo) {
                                        if (err) {
                                            console.log("ENTRY NOT CREATED FOR NEW MEMBER FIRST TIME TO THE MEETING.");
                                        } else {
                                            console.log("ENTRY CREATED FOR NEW MEMBER FIRST TIME TO THE MEETING.");
                                        }
                                    }
                                );
                            } else {
                                    console.log("FOUND")
                                    const filter = { name: element };
                                    const update =  { $inc: { present: 1 }};
                                    user.findOneAndUpdate(filter, update,function (err,res) {
                                        if (err) {
                                            console.log("NOT MARKED AS PRESENT");
                                        } else {
                                            console.log("MARKED AS PRESENT");
                                        }
                                    });
                            }
                        }
                    });
                });
            
            }).catch((message) => {
                console.log(message)
            })
            
            
            
            
        }
    }
);

