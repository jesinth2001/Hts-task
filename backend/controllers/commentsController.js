const Comment = require('../models/commentsModels')
const Post =require('../models/postModels')


const postComment = async(req,res)=>{
   try{
    const comments=req.body
    await Comment.create(comments)
    const findPost =await Post.findOne({id:req.body.postId})
    console.log(findPost)
    if(findPost)
    {
      await Post.findOneAndUpdate({id:findPost.id},{$inc:{noOfComments:1}})
    }
    res.status(200).json({
        postId:req.body.postId,
        success:1,
        message:"comments posted successfully"
    })

   }catch(err)
   {
    console.log(err)
    res.status(500).json({
        success:0,
        message:"post failed!"
    })
   }
}

const getComment =async(req,res) => {
    try{
        const postId=req.params.id
         const data = await Comment.find({postId:postId})
        res.status(200).json({
            success:1,
            data:data
        })
    
       }catch(err)
       {
        res.status(500).json({
            success:0,
            message:"login failed!"
        })
       }
}

module.exports ={postComment,getComment}