import React, { useEffect, useState } from 'react'
import "../css/createpost.css"
import { GET_ALL_POST, STORE_POST } from '../api'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
const [currentId,setCurrentId]=useState(0)

const [createPostData,setCreatePostData]=useState({
    userId:"",
    id:"",
    title:"",
    body:"",
})
useEffect(()=>{
  const getTotalPost =async () =>{
     await axios.get(GET_ALL_POST).then((res) => {
        if (res.data.success) {
          setCurrentId((res.data.data.length)+1)
          
        }
      }).catch((err) => {
        console.log("error getting", err)
      })
  }
  getTotalPost()
},[])
const [currentUserInfo,setCurrentUserInfo]=useState({
    email:"",
    userId:""
})
useEffect(()=>{
    const storeUser =JSON.parse(localStorage.getItem("current-user"))
    setCurrentUserInfo(storeUser)  
},[])

const handleFormValidation =() =>{
    const {title,body}=createPostData;
    if(title==="")
        {
            toast.error("Please Enter a title")
            return false;
        }
    if(body==="")
    {toast.error("Please Enter a Post content")
                return false;
     }
     return true;
}
const createPost =async() =>{

    const data=[]
    createPostData.id=currentId
    createPostData.userId=currentUserInfo.userId
    data.push(createPostData)
    console.log(data)
 
    if(handleFormValidation())
    {
        console.log("passvalidation")
        await axios.post(STORE_POST,data).then((res) => {

            if (res.data.success) {
              console.log(res)
              setCreatePostData({
                userId:"",
                id:"",
                title:"",
                body:"",
            })
              toast.success("toast created successfully")
            }
          }).catch((err) => {
            console.log('error updating db', err)
          })
    }
}

  return (
    <div className='create-post'>
        <ToastContainer/>
        <div className="create-form-container">
            <div className='create-form'>
                <h1>Create New Post</h1>
      
                <input type='text'
                 placeholder='Post Title' 
                 name='title'
                 value={createPostData.title}
                 onChange={(e)=>{setCreatePostData({...createPostData,[e.target.name]:e.target.value})}}
                 required/>
       
                <textarea type='text'
                 rows={10}
                 placeholder='Post Content'
                 name="body"
                 value={createPostData.body}
                 onChange={(e)=>{setCreatePostData({...createPostData,[e.target.name]:e.target.value})}}
                 required/>

                <div className='create-btn'>
                <button onClick={createPost}>Create</button>
                </div>
            </div>
        </div>      
    </div>
  )
}

export default CreatePost
