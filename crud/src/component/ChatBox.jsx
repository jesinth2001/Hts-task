import React, { useEffect, useRef, useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { GET_MESSAGE, SEND_MESSAGE } from '../api';
import axios from 'axios';


const ChatBox = ({currentChat,currentUser,socket}) => {
    const [message,setMessage]=useState("")
    const [chatMessage,setChatMessage]=useState([])
    const [arrivalMessage,setArrivalMessage]=useState(null)
    const scrollRef=useRef(null)
    const [userTyping,setUserTyping]=useState(false)
    const sendMessage =async()=>{

        await axios.post(SEND_MESSAGE,{
            from:currentUser.id,
            to:currentChat._id,
            message:message
        }).then((res)=>{
            console.log(res.data.message)
            socket.current.emit('send-msg',{
                from:currentUser.id,
                to:currentChat._id,
                message:message,
                time:Date.now()
            })
            const msg =[...chatMessage]
            msg.push({fromSelf:true,message:message,time:Date.now()})
            setChatMessage(msg)
            setMessage("")
          
        }).catch((err)=>{
            console.log("error sending message",err)
        })
      
    }


  useEffect(() =>{
    if(socket.current){
      socket.current.on("msg-received",(msg) =>{
        setArrivalMessage({fromSelf:false,message:msg,time:Date.now()})
      })
    }
  },[])

  useEffect(() =>{
    arrivalMessage && setChatMessage((prev)=>[...prev,arrivalMessage])
  },[arrivalMessage])

  useEffect(() =>{
    scrollRef.current?.scrollIntoView()
  },[chatMessage])


    useEffect(()=>{

        const getMessage =async ()=>{
            await axios.post(GET_MESSAGE,{
                from:currentUser.id,
                to:currentChat._id,
            }).then((res)=>{
                if(res.data.success)
                    {
                        console.log(res.data.data)
                        setChatMessage(res.data.data)
                    }
            
            }).catch((err)=>{
                console.log("error getting  message",err)
            })
        }

        getMessage()

    },[currentChat])

    useEffect(()=>{
        if (socket) {
            socket.current.on('type-data', (userId) => {
                console.log(userId!=currentUser.id)
         
                if (userId == currentUser.id) {
                    setUserTyping(true);

                }
            });

            socket.current.on('type-data1', (userId) => {
                console.log(userId!=currentUser.id)
         
                if (userId == currentUser.id) {
                    setUserTyping(false);

                }
            });
        }
    },[])

    const handleChange =(e)=>{
        setMessage(e.target.value)
        
        socket.current.emit('typing',currentChat._id)
    }

    const handleBlur=()=>{
        
        socket.current.emit('close-typing',currentChat._id)
    }


 
    
  return (
    <div className='chat-box'>
      <header className='chat-header'>
        <div className='chat-box-logo'>
            <CgProfile/>
        </div>
        <div className='chat-box-info'>
            <span>{currentChat.email}</span>
            <span className='uid'>Uid:{currentChat.userId}  
             <span className='userTypingMsg'>{userTyping ? "Typing...":""}</span>
            </span>

        </div>
        
      </header>
      <section className='chat-box-body'>
        {
            chatMessage && chatMessage.map((chat,index)=>{
                return(<div key={index} ref={scrollRef}>
                    <div className={`message ${chat.fromSelf?"sender":"receiver"}`}>
                    <div className='content'>
                        <p>{chat.message}</p>
                      
                    </div>
                    <p className='timeStamps'>
                    {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    </div>
                </div>)
            })

        }

      </section>
      <footer className='chat-box-footer'>
        <input type='text' 
        value={message}
        placeholder='Message..' 
        onBlur={handleBlur}
        onChange={(e)=>{handleChange(e)}}/>
        <button onClick={sendMessage}>send</button>
      </footer>
    </div>
  )
}

export default ChatBox
