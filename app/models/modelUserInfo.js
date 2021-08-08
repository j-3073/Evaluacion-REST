const mongoose = require('mongoose')

//Schema for users info colecction
const informationSchema = new mongoose.Schema({
    _id:{ type:String },
    first_name:{ type:String, required:true },
    area:{ type:Number, required:true },
    department:{ type:Number },
    career:{ type:Number },
    contract:{ type:Number },
    address:{
        street: { type:String, required:true },
        num: { type:Number, required:true },
        postal_code: { type:Number, required:true }
    },
    b_day:{ type:Date, required:true }
})

module.exports = mongoose.model('Info', informationSchema)