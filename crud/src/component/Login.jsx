import React, { useEffect, useState } from 'react'
import "../css/login.css"
import { IoMdMail } from "react-icons/io";
import { FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LOGIN } from '../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useCookies} from "react-cookie"
import Cookies from "js-cookie"


const Login = () => {


    const [loginData,setLoginData]=useState({
        email:"",
        password:""
    })
    const nav =useNavigate()

    useEffect(()=>{

        const accessToken=Cookies.get('jwt_token')
        if(accessToken)
            {
                   nav("/")
            }
    },[])

  const handleValidation = () =>{
   const {email,password} =loginData;
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   if(email==="")
    {
        toast.error("Please Enter Email!")
        return false 
    }
    if(emailRegex.test(email)==false)
        {
            toast.error("Please Enter a Valid Email!")
            return false     
        }
     if(password==="")
        {
            toast.error("Please Enter Password!")
            return false
        }

        return true
  }
  const handleLogin =async() =>{

        if(handleValidation())
        {
             await axios.post(LOGIN,loginData,{withCredentials:true}).then((res)=>{
                console.log(res.data.success)
                if(res.data.success)
                    {
                        
                         localStorage.setItem('current-user',JSON.stringify(res.data))
                         nav("/")
                     
                    }
             }).catch((err)=>{
                console.log("server side error : ",err.response.data.message)
                toast.error(err.response.data.message)
             })
        }


  }
  return (
    <div className='login'>
        <ToastContainer/>
        <div className='login-container'>
             <div className='login-form'>
                <div className='input-container'>
                <input type="text" 
                name="email"
                onChange={(e)=>{setLoginData({...loginData,[e.target.name]:e.target.value})}}
                required/>
                <label>Email</label>
                <span className='form-logos'><IoMdMail/></span>
                </div>

                <div className='input-container'>
                <input type ="password"
                name="password"
                onChange={(e)=>{setLoginData({...loginData,[e.target.name]:e.target.value})}}
                required/>
                <label>Password</label>
                <span className='form-logos'><FaEyeSlash/></span>
                </div>
            
                 <input type ="button"  value="Login" onClick={handleLogin}/>
             </div>
        </div>
    </div>
  )
}

export default Login
