const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
//WRITE YOUR MONGO URI
const URI = "YOUR_URI"
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true }); 

app.use(cors())



app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


let exerciseSessionSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String,
})

let userSchema = new mongoose.Schema({
  username: {type:String, required:true},
  log: [exerciseSessionSchema]
})

let ExerciseSession = mongoose.model("Session", exerciseSessionSchema)

let User = mongoose.model("User", userSchema)


let responseObj = {}
app.post("/api/exercise/new-user", bodyParser.urlencoded({extended: false}),(request,response)=>{
  let newUser = new User({
    username: request.body["username"]
  })
  newUser.save((err,data)=>{
    if(err){
      console.log(err)
    }else{
      responseObj["username"] = data["username"]
      responseObj["_id"] = data["_id"]
      response.json(responseObj)
    }
  })
})

app.get("/api/exercise/users", (request,response)=>{
  User.find({}, (err,data)=>{
    if(!err){
      response.json(data)
    }
  })
})

app.post("/api/exercise/add",bodyParser.urlencoded({extended: false}) ,(request,response)=>{
  let userId = request.body["userId"];


  let newSession = new ExerciseSession({
    description: request.body["description"],
    duration: parseInt(request.body["duration"]),
    date: request.body["date"]
  })

  if(newSession.date == ""){
    newSession.date = new Date().toISOString().substring(0,10);
  }

    User.findByIdAndUpdate(userId, {$push: {log: newSession}},{new: true}, (err,data)=>{
      if(!err){
        responseObj["_id"] = data["_id"];
        responseObj["username"] = data["username"]
        responseObj["date"] = new Date(newSession["date"]).toDateString()
        responseObj["duration"] = newSession["duration"]
        responseObj["description"] = newSession["description"]
        response.json(responseObj)
      }else{
        console.log(err)
      }
    })
})

app.get("/api/exercise/log", (request,response)=>{
  User.findById(request.query["userId"],(err,data)=>{
    if(!err){
      responseObj = data
      if(request.query.from || request.query.to){
        
        let fromDate = new Date(0)
        let toDate = new Date()
        
        if(request.query.from){
          fromDate = new Date(request.query.from)
        }
        
        if(request.query.to){
          toDate = new Date(request.query.to)
        }
        
        fromDate = fromDate.getTime()
        toDate = toDate.getTime()
        
        responseObj.log = responseObj.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime()
          
          return sessionDate >= fromDate && sessionDate <= toDate
          
        })
        
      }
      
      if(request.query.limit){
        responseObj.log = responseObj.log.slice(0, request.query.limit)
      }
      responseObj["count"] = data["log"].length;
      response.json(responseObj)
    }
  })

})
