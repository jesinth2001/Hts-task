const mongoose = require('mongoose')

const commentsSchema = mongoose.Schema({
    postId:{ type: Number,required:true },
    comments:{type:String,required:true},
    likes: {
        type: [Number],
        default:[] 
    },
    userId:{type:Number,required:true}
});


module.exports = mongoose.model('comments',commentsSchema);