const Message=require("../models/messageModels")

const sendMessage =async (req,res) =>{

    const {from,to,message}=req.body

    try{
    const data=await Message.create({
        message:{text:message},
        users:[from,to],
        sender:from,

    })
    res.status(200).json({
        success:1,
        message:"message sent"
    })}
    catch(err){
        console.log(err)
        res.status(500).json({
            success:0,
            message:"message not sent"
        })
    }
}

const getMessage =async(req,res) =>{

     const {from,to}=req.body
    try{
        const getMessage = await Message.find({
            users:{
                $all:[from,to]
            }}).sort({updatedAt:1})
      const allmessage =getMessage.map((msg)=>{
        return({
            fromSelf:msg.sender.toString()===from,
            message:msg.message.text,
            time:msg.createdAt,
        })
      })
          res.status(200).json({
            success:1,
            data:allmessage
        })
    }catch(err)
    {
        console.log(err)
        res.status(500).json({
            success:0,
            message:"error getting message"

        })
    }

}

module.exports={
    sendMessage,
    getMessage
}