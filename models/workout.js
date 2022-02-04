const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now //Defaults to today
  },
  exercises: [{
    type: {
      type: String,
      trim: true,
    },