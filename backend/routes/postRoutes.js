const {createPost, DeleteAllPost, getAllPost, deletePost, updatePost, uploadImage, addImage, likePost, searchPost} =require("../controllers/postController")
const express =require('express')
const {checkTokenIsValid} =require("../middlewares/authentication")
const router = express.Router()

router.get("/getAllPost",getAllPost)
router.post("/createPost",checkTokenIsValid,createPost)
router.delete("/deleteAllPost",DeleteAllPost)
router.put("/deleteById/:id",checkTokenIsValid,deletePost)
router.patch("/updateById",checkTokenIsValid,updatePost)
router.put("/uploadImage/:id",checkTokenIsValid,uploadImage,addImage)
router.put('/likePost/:id',checkTokenIsValid,likePost)
router.get('/searchPost/:search',searchPost)

module.exports = router;