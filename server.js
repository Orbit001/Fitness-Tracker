const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", 
{ useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false });

app.get("/stats", (req, res) => {
  res.sendFile(__dirname + "/public/stats.html");
});

app.get("/exercise", (req, res) => {
  res.sendFile(__dirname + "/public/exercise.html");
});

app.get("/api/workouts", (req, res) => { //Get last workout
  db.Workout.find({}).sort({ day: -1 }).limit(1)
    .then(dbWorkout => {
      console.log(dbWorkout);
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => { //Create and add new exercise to workout
  if(req.body.name == ""){ //Catch empty object
    res.json("Can't make empty object.");
  }
  db.Workout.findByIdAndUpdate(req.params.id, {$push: {exercises: req.body}}, {new : true})
    .then(dbWorkout => {
      console.log(dbWorkout);
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    })
});

app.post("/api/workouts", (req, res) => { //Create new workout
  let body = req.body;
  db.Workout.create(body)
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    console.log(err);
    res.json(err);
  });
});

app.get("/api/workouts/range", (req, res) => { //Find last 7 workouts
  db.Workout.find({}).sort({ day:-1}).limit(7)
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});