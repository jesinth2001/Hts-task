import React, { useEffect, useRef, useState } from 'react'
import Header from "../component/Header"
import Posts from "../component/Posts"
import {useCookies} from "react-cookie"
import { Route, Routes, useNavigate } from 'react-router-dom'
import { VERIFY_USER } from '../api'
import axios from 'axios'
import Cookies from "js-cookie"
import SideBar from './SideBar'
import CreatePost from './CreatePost'
import MyPost from './MyPost'
import Chat from './Chat'


const Main = () => {
   
  
    const nav=useNavigate()
    const [userLoggedIn,setUserLoggedIn]=useState(false)
    const sideBarRef=useRef(null)
    const [id,setId]=useState()
  
    useEffect(()=>{
        const accessToken=Cookies.get('jwt_token')
         if(!accessToken)
            {
                localStorage.clear('current-user')
                setUserLoggedIn(false)
                nav("/")
              
            }
            else{
              setUserLoggedIn(true)
            }
    },[userLoggedIn])


  


    // useEffect(()=>{
       

    //         const verifyUser = async() =>{
    //             const accessToken=Cookies.get('jwt_token')
    //             if(accessToken)
    //             {
    //               await axios.post(VERIFY_USER,{},{withCredentials:true,
    //                 headers:{
    //                     Authorization:`Bearer ${accessToken}`
    //                 }
    //               }).then((res)=>{
    //                 if(res.data.success)
    //                     {
                
    //                     }

    //               }).catch((err)=>{
    //                 if(err.response.data.success==0)
    //                     {
    //                          nav("/")
    //                          localStorage.clear('current-user')
    //                          Cookies.remove("jwt_token")
                             
    //                     }
    //               })
    //             }
               

    //         }
    //         verifyUser()

    // },[])

    const handleOpenSideBar =() =>{
      sideBarRef.current.classList.add('opensidebar')
    }
    const handleCloseSideBar =() =>{
      sideBarRef.current.classList.remove('opensidebar')
    }

  return (
    <div>
            <Header handleOpenSideBar={handleOpenSideBar}/>
            <SideBar sideBarRef={sideBarRef} handleCloseSideBar={handleCloseSideBar} setUserLoggedIn={setUserLoggedIn} userLoggedIn={userLoggedIn} />
             <Routes>
              <Route path="/" element={<Posts userLoggedIn={userLoggedIn} setId={setId}/>} />
              <Route path="/create-post" element={<CreatePost/>} />
              <Route path="/my-post" element={<MyPost/>}/>
              <Route path="/chats" element ={<Chat chatId={id}/>} />
             </Routes>
            
    </div>
  )
}

export default Main
