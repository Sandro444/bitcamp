'use strict';

var express = require('express');
var cors = require('cors');

// require and use "multer"...
const multer = require("multer")
const upload = multer({dest:'uploads/'});

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});

app.post("/api/fileanalyse", upload.single("upfile") , (request, response)=>{
  let fname = request.file.originalName;
  let ftype = request.file.mimetype;
  let fsize = request.file.size;

  response.json({
    name: fname,
    type: ftype,
    size: fsize
  })

})