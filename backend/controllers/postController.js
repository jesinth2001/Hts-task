const Post =require("../models/postModels")
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public') 
    },
    filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-'+file.originalname) 
    }
  });
  
const upload = multer({ storage: storage });

const uploadImage =upload.single("image")


const getAllPost = async(req,res) =>{
     try{
        const getData =await Post.find({}).sort({id:1})
        res.status(201).json({success:1,
            data:getData
        })
     }
     catch(error)
     {
        res.status(500).json({ success:0,message:error});
     }
}

const createPost =async(req,res) =>{
        try {
            const postData =req.body;
            await Promise.all(postData.map(async (post) => {
                const existingPost = await Post.findOne({ id: post.id });
                if (!existingPost) {
                    await Post.create(post);
                }
            }))
            res.status(201).json({
                success:1,
                message:"inserted successfully"
            })
        } catch (error) {
            res.status(500).json({ success:0,message:error});
        }
}
const updatePost =async(req,res) =>{
    try{
      const {id,title,body}=req.body;
      await Post.findOneAndUpdate({id:id},{$set:{title:title,body:body}})
      res.status(201).json({
        success:1,
        message:"updated successfully"
    })
    }
    catch(error){
        res.status(500).json({ success:0,message:error});
    }
}

const deletePost = async(req,res)=>{
try {
    const postId=req.params.id
    console.log(postId)
     await Post.deleteOne({id:postId})
    res.status(201).json({
        success:1,
        message:"Deleted Successfully"
    })
}
catch(err)
{
    res.status(500).json({ success:0,message:error});
}
}

const DeleteAllPost =async(req,res)=>{
    try{
        await Post.deleteMany();
        res.status(201).json({
            success:1,
            message:"Deleted Successfully"
        })
    }
    catch{
        res.status(500).json({ success:0,message:error});
    }
}

const addImage = async(req,res) =>{

    try{
  const file = req.file.filename
  const id=req.params.id;
  await Post.findOneAndUpdate({id:id},{$set:{image:file}})
  res.status(201).json({
    success:1,
    message:"image Uploaded successfully"
})
    }
    catch(err){
        res.status(500).json({ success:0,message:err});
    }
}
const likePost = async(req,res) =>{
    const postId=req.params.id;
    const {userId} =req.body
   
    const findPost = await Post.findOne({id:postId })
    
    if(findPost)
    {
        const userIndex=findPost.likes.indexOf(userId)
        if(userIndex==-1)
            {
              await Post.findOneAndUpdate({id:postId },{$push:{likes:userId}})
            }
            else{
          await Post.findOneAndUpdate({ id:postId }, { $pull: { likes:userId } });
            }
    }
    return res.status(200).json({success:1,message:"likes and dislike"})

    
}

const searchPost = async(req,res)=>{
    const search=req.params.search
    console.log("title",search)
    try{
        const posts = await Post.find({ title: { $regex: search, $options: 'i' } });
        // console.log(posts)
         res.status(200).json({
            success:1,
            message:"search successfull!",
            data:posts
         })
    }
    catch(err){
        // console.log(err)
        res.status(500).json({ success:0,message:err});
    }
}

module.exports={
    createPost,
    DeleteAllPost,
    getAllPost,
    deletePost,
    updatePost,
    uploadImage,
    addImage,
    likePost,
    searchPost,
}