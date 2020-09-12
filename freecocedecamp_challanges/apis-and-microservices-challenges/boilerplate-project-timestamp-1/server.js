// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

let responseObj = {}
app.get("/api/timestamp/:inputdate", function(req,res){
  let user_date = req.params.inputdate;
  if(user_date.includes("-")){
    responseObj["unix"] = new Date(user_date).getTime();
    responseObj["utc"] = new Date(user_date).toUTCString();
  } else{
    user_date = parseInt(user_date)
    responseObj["unix"] = new Date(user_date).getTime();
    responseObj["utc"] = new Date(user_date).toUTCString();
  }

  if(!responseObj["unix"] || !responseObj["utc"]){
    responseObj = {}
    responseObj["error"] = "Invalid Date";
  }
  res.json(responseObj)

})

app.get("/api/timestamp/", function(req,res){
  let date = new Date();
  res.json({
    unix:  date.getTime(),
    utc:  date.toUTCString()
  })
  
})