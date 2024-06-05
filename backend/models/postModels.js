const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    userId: { type: Number,required: true },
    id:{type:Number,required:true},
    title: { type: String,required: true },
    body: { type: String, required: true },
    image: {type:String},
    noOfComments:{type:Number ,default:0},
    likes: {
        type: [Number],
        default:[] 
    },
  

});


module.exports = mongoose.model('Post', postSchema);