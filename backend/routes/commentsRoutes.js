const express =require('express')
const { postComment, getComment } = require('../controllers/commentsController')
const {checkTokenIsValid} =require("../middlewares/authentication")
const router = express.Router()

router.post("/postComment",checkTokenIsValid,postComment)
router.get('/getComment/:id',getComment)

module.exports=router