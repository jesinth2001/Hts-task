import React, { useEffect, useRef, useState } from 'react'
import "../css/chat.css"
import ChatSideBar from './ChatSideBar'
import { GET_ALL_USER, SERVER } from '../api'
import axios from 'axios'
import Cookies from "js-cookie"
import ChatBox from './ChatBox'
import {io} from "socket.io-client"
import { IoMdChatbubbles } from "react-icons/io";
import { useParams } from 'react-router-dom'

const Chat = ({chatId}) => {
   const accessToken=Cookies.get('jwt_token')
   const [users,setUsers]=useState([])
   const [currentUser,setCurrentUser]=useState({})
   const [currentChat,setCurrentChat]=useState(undefined)

  
   console.log("id for",chatId)

   useEffect(()=>{
    const findUser=users.filter((idx)=>idx.userId==chatId)
    console.log("user found ",findUser[0])
    if(chatId)
      {
        setCurrentChat(findUser[0])
      }
   },[users,chatId])
   console.log("current",currentChat)

   useEffect(()=>{
    const storeUser =JSON.parse(localStorage.getItem("current-user"))
    setCurrentUser(storeUser)

  },[])

  const socket=useRef(null)
  useEffect(()=>{
    socket.current=io(SERVER)
    socket.current.emit('add-user',currentUser.id)

  },[currentUser])


    useEffect(()=>{
     const getAllUser= async()=>{
       await axios.get(GET_ALL_USER,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
       }).then((res)=>{
        if(res.data.success)
          {
            setUsers(res.data.data)
          }
       }).catch((err)=>{
        console.log('error getting users list....',err.response.data)
       })
     }
  getAllUser()
    },[])

  return (
    <div className='chat'>
          <div className='chat-cont'>
            <ChatSideBar users={users} currentUser={currentUser} setCurrentChat={setCurrentChat}/>
            {currentChat===undefined?<div className='welcome'>
              <span><IoMdChatbubbles/></span>
              <span>  Start a  New Conversation</span>
              </div>:<ChatBox currentChat={currentChat} currentUser={currentUser} socket={socket}/>}
          </div>
    </div>
  )
}

export default Chat
