import React, { useEffect, useRef, useState } from 'react'
import "../css/mypost.css"
import { DELETE_POST, GET_ALL_POST, GET_COMMENTS, IMAGE_URL, UPDATE_POST, UPLOAD_IMAGE } from '../api'
import axios from 'axios'
import { CgProfile } from "react-icons/cg";
import { FaHeart } from "react-icons/fa";
import { MdOutlineModeComment } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { BsThreeDotsVertical } from "react-icons/bs";
import Cookies from "js-cookie"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPost = () => {
    const [myPost,setMyPost]=useState([])
    const [isLoading,setIsLoading]=useState(false)
    const [currentUser,setCurrentUser]=useState({})
    const [comments,setComments]=useState([]);
    const [currentOpenCommentId,setCurrentOpenCommentId]=useState(null)
    const accessToken=Cookies.get('jwt_token')
    const [file,setFile]=useState("")
    const [editData,setEditData]=useState({
      id:'',
      title:'',
      body:''
    })
    const popupRef=useRef(null)

    const mypostRef=useRef(null)
    useEffect(()=>{
        const storeUser =JSON.parse(localStorage.getItem("current-user"))
        setCurrentUser(storeUser)
    
      },[])


    useEffect(() => {
        const getAllPost = async () => {
          await axios.get(GET_ALL_POST).then((res) => {
            if (res.data.success) {
              setMyPost(res.data.data)
              setIsLoading(false)
            }
          }).catch((err) => {
            console.log("error getting", err.response.data)
          })
        }
        getAllPost()
      }, [isLoading])

       
      const openCommentSection =async (id) =>{
        if (currentOpenCommentId!=null) {
          // Close the currently open comment section
          closeCommentSection(currentOpenCommentId);
      }

        
        await axios.get(`${GET_COMMENTS}/${id}`).then((res)=>{
            if(res.data.success)
             {
               setComments(res.data.data)
               document.getElementById(id).classList.add('open-cmt')
               setCurrentOpenCommentId(id);
            
             }
         }).catch((err)=>{
           console.log("error getting comments",err);
         })
      }
      const closeCommentSection =(id) =>{
        document.getElementById(id).classList.remove('open-cmt')
        setCurrentOpenCommentId(null);
      }

      const openEditOptions=(id)=>{
        const opt='opt'+id
        console.log(opt)
        if (currentOpenCommentId!=null) {
          // Close the currently open comment section
          closeOptions(currentOpenCommentId);
      }
        document.getElementById(opt).classList.add('open-opt')
        setCurrentOpenCommentId(opt)
      }
      const closeOptions=(id)=>{
      
      
        document.getElementById(id).classList.remove('open-opt')
      
        setCurrentOpenCommentId(null)
        setFile("")
        const fileInput = document.getElementById('imageFile'); // Replace 'yourFileInputId' with the actual ID of your file input element
       if (fileInput) {
        fileInput.value = null;
     }
          
      }

      const deleteMyPost = async (id) => {
        await axios.put(`${DELETE_POST}/${id}`,{},{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        }).then((res) => {
          if (res.data.success) {
            setIsLoading(true)
            setCurrentOpenCommentId(null)
            toast.success("successfully Deleted")
          }
        }).catch((err) => {
          console.log("Error Deleting", err.response.data)
        })
      }
    

      const handleImageUpload =(event)=>{
        const files=event.target.files[0]
       
         if(files)
          {
             setFile(files)
          }
      } 
      const handleImageValidation =() =>{
        const maxSizeInBytes = 1 * 1024 * 1024
    
        console.log("filesize:",file.size,"limt:",maxSizeInBytes)
        if(file && !file.type.startsWith("image/"))
          {
            toast.error("Please Upload Valid Image Source")
            return false;
          }
          if(file==="")
            {
              toast.error("Please Choose Image to Upload")
              return false;
            }
            if (file.size > maxSizeInBytes) {
              toast.error('Image size exceeds 1MB. Please choose a smaller image.');
              return false;
          }  
           
            return true;
      }

      const uploadImage = async(id) =>{
        if(handleImageValidation())
          {
        const formData = new FormData();
        formData.append('image', file);
        await axios.put(`${UPLOAD_IMAGE}/${id}`,formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
             Authorization: `Bearer ${accessToken}`
          }
        }).then((res)=>{
          console.log(res)
          if(res.data.success)
            {
              closeOptions('opt'+id)
              setIsLoading(true)
              setFile("")
            }
        }).catch((err)=>{
          console.log("Error uploading Image",err.response.data)
        })
      }
      }


      const editPost =(id,title,body)=>{

        setEditData({
          id:id,
          title:title,
          body:body
        })
        popupRef.current.classList.add('open-popup')
        console.log(editData)
      }
      const closeEditPost =() =>{
        popupRef.current.classList.remove('open-popup')
      }

      const handleValidation =() =>{
        const {title,body}=editData;
        if(title==="")
          {
            toast.error("Please Enter a title")
            return false;
          }
          if(body==="")
            {
              toast.error("Please Enter a body content")
              return false;
            }
            return true;
      }

      const saveChanges =async() =>{

        if(handleValidation())
          {
        
        await axios.patch(UPDATE_POST,editData,{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        }).then((res)=>{
          if(res.data.success)
            {
              setEditData({
                id:"",
                title:"",
                body:""
              })
              setIsLoading(true)
              popupRef.current.classList.remove('open-popup')
            }
    
        }).catch((err)=>{
          console.log("error updating ",err)
        })
      }
    
      }
    

  return (<>
  <ToastContainer/>
    <div className="myposts">

       {
        myPost.filter((idx)=> {return idx.userId==currentUser.userId}).map((post)=>{
            return(<div className='mypost-card'>
                 <div className='mypost-profile'>
                    <span className='logo'><CgProfile/></span>
                    <div className='profile-info'>
                        <span>{currentUser.email}</span>
                        <span>User Id:{currentUser.userId}</span>
                    </div>
                    <div className='mypost-edit-del'>
                      <span onClick={()=>{openEditOptions(post.id)}}><BsThreeDotsVertical/></span>
                    </div>
                 </div>
                 {post.image?
                 <img src={`${IMAGE_URL}/${post.image}`}/>:""}
                 <div className='mypost-user-func'>
                    <span><FaHeart/></span>
                    <span onClick={()=>{openCommentSection(post.id)}}><MdOutlineModeComment/></span>
                 </div>
                 <div className='mypost-like-comments'>
                    <span>{post.likes.length} Likes</span>
                    <span>{post.noOfComments} Comments</span>
                 </div>
                 <h2>{post.title}</h2>
                 <p>{post.body}</p>


                 <div className='mypost-comments' id={post.id} >
                    <div className='comment-header'>
                        <h4>Comments</h4> 
                        <span onClick={()=>{closeCommentSection(post.id)}}><ImCross/></span>
                        </div>
                        <div className='mypost-all-comments'>
                    {comments.length>0?comments.map((cmt)=>{ 
                    if(cmt.postId==post.id)
                        return(<div className='mypost-cmt-area'>
                          <h5>posted by {cmt.userId}</h5>
                          <p>{cmt.comments}</p>
                        </div>)
                        
                        }):<div>No Comments yet</div>}
                        </div>
                 </div>

                  <div className='mypost-opt' id={`opt${post.id}`}>
                    <div className='mypost-opt-body'>
                      <div >
                        <label onClick={()=>{editPost(post.id,post.title,post.body)}}>Edit post</label> 
                        
                        <span onClick={()=>{closeOptions(`opt${post.id}`)}}><ImCross/></span></div>
                      <div>
                        <label>Upload Image</label>
                        <input type='file' id="imageFile" accept='image/*' onChange={handleImageUpload}/>
                        <button onClick={()=>{uploadImage(post.id)}}>Upload </button>
                      </div>
                      <div 
                    
                      >  <label onClick={()=>{deleteMyPost(post.id)}}>Delete Post</label></div>
                    </div>
                  </div>

            </div>)
        })
       }
        <div className="popup-form" ref={popupRef}>
        <div className='form'>
          <h2>Edit Post</h2>
          <input type='text'
          name='title'
          value={editData.title}
          onChange={(e)=>{setEditData({...editData,[e.target.name]:e.target.value})}}
          />
          <textarea type='text'
           rows={"10"}
           name='body'
           value={editData.body}
           onChange={(e)=>{setEditData({...editData,[e.target.name]:e.target.value})}}/>
          <div className='pop-btn-cont'>
            <button onClick={saveChanges}>Save Changes</button>
            <button onClick={closeEditPost}>Cancel</button>
          </div>
        </div>
    </div>
    </div>
 </>)
}

export default MyPost
