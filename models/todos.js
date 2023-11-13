const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    todo:{type: String,
        required:true},
},{timestamps: true});

const Todos = mongoose.model("Todos", todoSchema);

module.exports = Todos