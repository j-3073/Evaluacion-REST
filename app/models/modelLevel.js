const mongoose = require('mongoose')

//Schema for levels colecction
const LevelSchema = new mongoose.Schema({
    level:{ type:String, required:true },
    name:{ type:Object, required:true }
})

module.exports = mongoose.model('Level', LevelSchema)