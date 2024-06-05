const express =require('express')
const {checkTokenIsValid} =require("../middlewares/authentication")
const { sendMessage, getMessage } = require('../controllers/messageController')
const router = express.Router()

router.post("/sendMessage",sendMessage)
router.post("/getMessage",getMessage)

module.exports=router