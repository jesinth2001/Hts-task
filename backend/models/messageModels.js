const mongoose = require('mongoose')

const messageSchema =new mongoose.Schema({
    message:{ 
        text:{
            type: 'string',
            required:true 
        },
        },
    users:Array,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin",
        required:true
    },
},{timestamps:true});

module.exports = mongoose.model('message',messageSchema);