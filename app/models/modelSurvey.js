const mongoose = require('mongoose')

//Schema for evaluation colecction
const EvaluationSchema = new mongoose.Schema({
    _id:{ type:String },
    records:{ type:Object }
})

module.exports = mongoose.model('Evaluation', EvaluationSchema)