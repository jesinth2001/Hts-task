const express =require('express');
const { register, login, getAllUser } = require('../controllers/adminController');
const {checkTokenIsValid} =require("../middlewares/authentication")
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/checkUser",checkTokenIsValid)
router.get("/getAllUser",checkTokenIsValid,getAllUser)

module.exports=router;