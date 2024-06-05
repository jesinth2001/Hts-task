const jwt=require("jsonwebtoken")

const checkTokenIsValid = async(req,res,next)=>{
     let token=req.get("Authorization")
       if(token)
        {
             token=token.split(" ")[1]
            jwt.verify(token,process.env.jwt_key,(err,decoded)=>{
                if(err)
                    {
                        
                        return res.status(401).json({
                            success:0,
                            message:"invalid token"
                        })
                    }
                    else{
                        req.decoded=decoded
                        next()
                    }
            })
        }
        else{

            return res.status(401).json({
                success:0,
                message:"Access Denined !"
            })
        }

}


module.exports= {checkTokenIsValid}