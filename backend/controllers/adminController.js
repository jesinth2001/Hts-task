
const Admin =require("../models/adminModels");
const bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken")

const register = async(req,res)=>{
try{
  const {email,password,userId}=req.body
  const existingUser =await Admin.findOne({email:email})
  if(existingUser)
  {
    res.status(402).json({success:0,message:"already user exits"
    })
  }
  else{
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({email:email,password:hashedPassword,userId:userId})
    res.status(201).json({
      success:1,
      message:"registerd successfully"
    })
  }

}
catch(err){
    res.status(500).json({
        success:0,
        message:"registration failed!"
    })

}
}

const login = async(req,res) =>{
    try{
        const{email,password}=req.body;
        const sessionTime=3*24*60*60*1000

        const findUser = await Admin.findOne({ email:email});

        if(findUser)
            {
             
            if(await bcrypt.compare(password, findUser.password))
                {  

                    const jsonwebtoken=jwt.sign({email:email},process.env.jwt_key,{expiresIn:sessionTime})

                    res.cookie('jwt_token',jsonwebtoken,{
                        withCredentials:true,
                        httpOnly:false,
                        maxAge:sessionTime,
                        sameSite:'lax',
                    })
                   return res.status(201).json({
                        success:1,
                        email:findUser.email,
                        userId:findUser.userId,
                        id:findUser._id,
                        data:jsonwebtoken,
                        message:"login successful!"
                    })
                }
            else{

                res.status(402).json({
                    success:0,
                    message:"Invalid Password!"
                })

            }

       }
       else{
        res.status(402).json({
            success:0,
            message:"Invalid Email!"
        })

       }
    }
    catch(err){
        res.status(500).json({
            success:0,
            message:"login failed!"
        })
    }
}

const getAllUser = async(req,res)=>{
    try{
        const  users = await Admin.find({}).select('_id userId email');
        res.status(200).json({
        success:1,
        data:users,
        message:"all users loaded"
       })
    }
    catch(err){
        res.status(500).json({
            success:0,
            message:"failed to get"
        })
    }
}


module.exports ={register,login,getAllUser};