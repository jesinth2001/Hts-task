import React from 'react'
import "../css/chat.css"
import { CgProfile } from "react-icons/cg";

const ChatSideBar = ({ users, currentUser,setCurrentChat }) => {

  const changeCurrentChat =(userChat)=>{
    setCurrentChat(userChat)
  }
  return (
    <div className='chat-sidebar'>
      <div className='chat-user-prof'>
        <span className='chat-logo'><CgProfile /></span>
        <div className='chat-user-info'>
          <span>{currentUser.email}</span>
          <span> userId : {currentUser.userId}</span>
        </div>
      </div>
      <div className='chat-user-cont'>
        {
          users.map((idx,index) => {
            if(currentUser.userId!=idx.userId)
              {
            return (<div className='chat-user-list' key={index}
             onClick={()=>{changeCurrentChat(idx)}}>
              <span className='chat-user-list-logo'><CgProfile /></span>
              <div className='chat-user-list-info'>
                <span>{idx.email}</span>
                <span> userId : {idx.userId}</span>
              </div>
            </div>)
              }
          })
        }
      </div>

    </div>
  )
}

export default ChatSideBar
