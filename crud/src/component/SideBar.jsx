import React, { useEffect, useState } from 'react'
import "../css/sidebar.css"
import { RxCrossCircled } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import Cookies from "js-cookie"
import { useNavigate } from 'react-router-dom';
const SideBar = ({sideBarRef,handleCloseSideBar,setUserLoggedIn,userLoggedIn}) => {
    const [currentUserInfo,setCurrentUserInfo]=useState({
        email:"",
        userId:""
    })
    const nav =useNavigate()
    useEffect(()=>{
        const storeUser =JSON.parse(localStorage.getItem("current-user"))
        setCurrentUserInfo(storeUser)  
        console.log("rendering")
    },[userLoggedIn])

    const handleLogout =() =>{
        Cookies.remove('jwt_token')
        localStorage.clear('current-user')
        nav("/")
        setUserLoggedIn(false)
    }
    const handleNavigation =(path) =>{
       nav(path)
       handleCloseSideBar();
    }
  return (
  
    <div className='sidebar' ref={sideBarRef}>
      <span className='nav-close'><RxCrossCircled onClick={handleCloseSideBar}/></span>
      {currentUserInfo?
      (<div>
      <div className='user-profile'>
        <span><CgProfile/></span>
        <div className='user-info'>
        <span>{currentUserInfo.email}</span>
        <span>UserId:{currentUserInfo.userId}</span>
        </div>
      </div>
      <div className='nav-menu'>
         <div className={window.location.pathname=='/'?"menu-items active":"menu-items"}  onClick={()=>{handleNavigation("/")}}>All Post</div>
         <div className={window.location.pathname=='/my-post'?"menu-items active":"menu-items"}   onClick={()=>{handleNavigation("/my-post")}}>My Post</div>
          <div className={window.location.pathname=='/create-post'?"menu-items active":"menu-items"}  onClick={()=>{handleNavigation("/create-post")}}>Create Post</div>

          <div className={window.location.pathname=='/chats'?"menu-items active":"menu-items"}  onClick={()=>{handleNavigation("/chats")}}>chats</div>
          
          <div className='menu-items' onClick={handleLogout}>Logout</div>
      </div>
      </div>):<div className='menu-items sb-login' onClick={()=>{handleNavigation("/login")}}>
            Login
         </div>}
    </div>)
}

export default SideBar
