const express =require('express')
const dotenv =require('dotenv')
dotenv.config()
const mongoose =require('mongoose')
const postRoutes =require('./routes/postRoutes')
const adminRoutes=require("./routes/adminRoutes")
const commentsRoutes =require("./routes/commentsRoutes")
const messageRoutes=require("./routes/messageRoutes")
const cors =require('cors')
const cookieParser =require('cookie-parser')
const socket =require("socket.io")





const app=express();

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
app.use(express.static('public'))
app.use(express.json());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,

}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/api',postRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/comments',commentsRoutes)
app.use('/api/message/',messageRoutes)
app.get("/",(req,res)=>{
    res.send("Hello World")
})
const server=app.listen(process.env.PORT,()=>{
    console.log(`Port is running on http://localhost:${process.env.PORT}`)
})

const io= socket(server,{
    cors: {
      origin:'http://localhost:3000',
      credentials:true,
    }
  })
  
  global.onlineUsers=new Map();
  io.on('connection',(socket) => {
    global.chatSocket=socket;
    socket.on('add-user',(userId)=>{
      onlineUsers.set(userId,socket.id);
    //   console.log(onlineUsers)
    //   console.log("server connected")
    });
  
    socket.on('send-msg',(data)=>{
   
      const sender=onlineUsers.get(data.to);
    //   console.log(sender)
      if(sender){
        socket.to(sender).emit("msg-received",data.message,data.time);
      }
    });

    // socket.on('add-user',(userId)=>{
    //     onlineUsers.set(userId,socket.id);
    //   //   console.log(onlineUsers)
    //   //   console.log("server connected")
    //   });

    socket.on('typing',(userId)=>{
        const sender =onlineUsers.get(userId)
        console.log(sender)

        if(sender)
            {
                
            io.to(sender).emit('type-data',userId)
            }
    });
    socket.on('close-typing',(userId)=>{
        const sender =onlineUsers.get(userId)
        console.log(sender)

        if(sender)
            {
                
            io.to(sender).emit('type-data1',userId)
            }
    });
  
  })