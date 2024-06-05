import React, { useEffect, useRef, useState } from 'react'
import { BASE_URL, DELETE_POST, GET_ALL_POST, GET_COMMENTS, GET_SERACH_POST, IMAGE_URL, LIKE_POST, POSTS, POST_COMMENTS, STORE_POST, UPDATE_POST, UPLOAD_IMAGE } from '../api'
import axios from 'axios'
import "../css/post.css"
import { MdEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegThumbsUp } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import Cookies from "js-cookie"
import { IoMdChatbubbles } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


const Posts = ({userLoggedIn,setId}) => {

  const [post, setPost] = useState([])
  const [comments,setComments]=useState([])
  const [loading, setIsLoading] = useState(false)
  const [currentUserComment,setCurrentUserComment]=useState()
  const [searchValue,setSearchValue]=useState("")
  const [btn,setBtn]=useState(false)
  const nav=useNavigate()
  const [commentData,setCommentData]=useState(
    {
      postId:"",
      userId:"",
      comments:""
    
    }
  )
  const popupRef=useRef(null)
  const commentRef=useRef(null)
  
 
  // const [isFileError,setIsFileError]=useState(true)
  const [currentPage,setCurrentPage]=useState(1);
  const postPerPage=9;
  const lastIndex= currentPage *postPerPage;
  const  firstIndex=0;
  const records=post.slice(firstIndex,lastIndex)
  const npages = Math.ceil(post.length / postPerPage) 
  const accessToken=Cookies.get('jwt_token')
  const [file,setFile]=useState("")
  const [currentUser,setCurrentUser]=useState({})
  const [editData,setEditData]=useState({
    id:'',
    title:'',
    body:''
  })
  useEffect(()=>{
    const storeUser =JSON.parse(localStorage.getItem("current-user"))
    setCurrentUser(storeUser)

  },[userLoggedIn])
 

  useEffect(() => {
    const getAllPost = async () => {
      await axios.get(GET_ALL_POST).then((res) => {
        if (res.data.success) {
          setPost(res.data.data)
          setIsLoading(false)
          setBtn(false)
        }
      }).catch((err) => {
        console.log("error getting", err)
      })
    }
    getAllPost()
    console.log("rendering post page")
  }, [loading])

  const postData = async (data) => {
    await axios.post(STORE_POST,data,{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    }).then((res) => {

      if (res.data.success) {
        console.log(res)
        setIsLoading(true)
      }
    }).catch((err) => {
      console.log('error updating db', err)
    })
  }

  const syncData = async () => {
    await axios.get(POSTS).then((res) => {
      if (res.status == 200) {
        postData(res.data)
      }
    }).catch((err) => {
      console.log("error getting data ", err)
    })
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

  const getComments =async(id) =>{
    await axios.get(`${GET_COMMENTS}/${id}`).then((res)=>{
      if(res.data.success)
       {
         console.log(res.data.data)
         setComments(res.data.data)
       }
   }).catch((err)=>{
     console.log("error getting comments",err);
   })
  }

  const handleComment =()=>{
;
    console.log("comments",comments)
    if(commentData.comments.length==0)
      {
        toast.error("comments should not be empty!")
        return false
      }
       return true
  }

  const postComments =async() =>{
    if(handleComment())
      {
        console.log("pass")
      await axios.post(POST_COMMENTS,commentData,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      }).then((res)=>{
        if(res.data.success)
          {
            getComments(res.data.postId)
            setIsLoading(true)
            commentData.comments=""
           
          }
      }).catch((err)=>{
        console.log("error posting comments",err)
      })
    }

  }
  const openComments = async (id,uid)=>{
    setCurrentUserComment(uid)
    commentRef.current.classList.add('open-comment')
    getComments(id)
    setCommentData({
      postId:id,
      userId:currentUser.userId,
      comments,
    })
  }
  const closeComments =()=>{
    commentRef.current.classList.remove('open-comment')
    setComments([])
    setCommentData({
      postId:"",
      userId:"",
      comments:"",
    })
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

  const deletePost = async (id) => {
    await axios.put(`${DELETE_POST}/${id}`,{},{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    }).then((res) => {
      if (res.data.success) {
        setIsLoading(true)
        toast.success("successfully Deleted")
      }
    }).catch((err) => {
      console.log("Error Deleting", err.response.data)
    })
  }

  const handleImageUpload =(event)=>{
    const files=event.target.files[0]
    console.log(files)
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
          document.getElementById('file').value=''
          setIsLoading(true)
          setFile("")
        }

    }).catch((err)=>{
      console.log("Error uploading Image",err.response.data)
    })
  }
  }
  const handleLikePost =async(postId,userId) =>{
    await axios.put(`${LIKE_POST}/${postId}`,{userId},{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    }).then((res)=>{
      if(res.data.success)
        {
          setIsLoading(true)
        }
    }).catch((err)=>{
      console.log("error like",err.response.data)
    })
  }
  const handleLoadMore =() =>{
    console.log(currentPage,npages)
    if(currentPage<=npages)
      {
        setCurrentPage(currentPage+1)
      }
  }
  const searchPost =async()=>{
    console.log('search value',searchValue)
    await axios.get(`${GET_SERACH_POST}/${searchValue}`).then((res)=>{
      if(res.data.success)
        {
          console.log(res.data.data)
          setPost(res.data.data)
          setSearchValue("")
          setBtn(true)

        }
    }).catch((err)=>{
      console.log("error serching...",err.response.data)
    })
  }
  
  return (<div className='post-body'>
    <ToastContainer/>
    <div className='btn-cont'>
      <div className='search-cont'>
         
 
        <input type='text'
         value={searchValue}
         onChange={(e)=>{setSearchValue(e.target.value)}}/>
        <button onClick={searchPost}>Search</button>
        {
         btn? <button onClick={()=>{setIsLoading(true)}}>back</button>:""
        }
       
      </div>
      <button onClick={syncData}> SYNC </button>
    </div>
    <div className='post-cont'>{
      records.length>0?records.map((itm, index) => {
        return (<div className='post-card' key={index}>
          <h5>Posted by :User-id-{itm.userId}</h5>
          <h2>{itm.title}</h2>
          <img src={itm.image?`${IMAGE_URL}/${itm.image}`:""}/>
          <p>{itm.body}</p>
          { currentUser && currentUser.userId==itm.userId?(<>
          <div className='upload-image'>
            <input id ="file" type='file' accept='image/*' onChange={(e)=>{handleImageUpload(e)}}/>
            <button onClick={()=>{uploadImage(itm.id)}}>Upload Image</button>
          </div>
          <div className='user-opt'>
            <span onClick={()=>{editPost(itm.id,itm.title,itm.body)}}><MdEdit /></span>
            <span onClick={() => { deletePost(itm.id) }}><AiOutlineDelete/></span>
          </div></>):""}
          <div className='user-func'>
          {currentUser && currentUser.userId!=itm.userId?
          
          (<div className='like-bar'>
            <span onClick={()=>{handleLikePost(itm.id,currentUser.userId)}}>{itm.likes.indexOf(currentUser.userId)==-1?(<FaRegThumbsUp/>):(<FaThumbsUp/>)}</span>
            <span>{itm.likes.length}</span>
          </div>):(<div><span>Likes:{itm.likes.length}</span></div>)
          }
          <div className='comment-bar'>
           <span onClick={()=>{openComments(itm.id,itm.userId)}}><FaRegComment /></span>
           <span>{itm.noOfComments}</span>
          </div>

        {currentUser && currentUser.userId!=itm.userId ?<div className='comment-bar chat-bar' onClick={()=>{setId(itm.userId);nav("/chats")}}>
            <span><IoMdChatbubbles/></span>
            <span>chat</span>
          </div>:""}
          </div>
        </div>)
      }):<div>No result found</div>
    }
    </div>
    <div className='load-more'>{currentPage==npages?"":<button onClick={handleLoadMore}>LoadMore</button>}</div>
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
          </div>
        </div>
    </div>

    <div className='popup-comment' ref={commentRef}>
      <div className='popup-comment-form'>
       <h2>Comments</h2>
       <div className='all-comments'>
       {comments.length!=0 ? comments.map((cmt,index)=>{
             return( 
             <div className='cmt' key={index}>
             <h4>posted by:{cmt.userId}</h4>
             <p>{cmt.comments}</p>
             </div>
           )
       }):<div>Comment box is empty !</div>}
       </div> 
       { currentUser && currentUser.userId!=currentUserComment? <textarea type='text' 
       name="comments"
       value={commentData.comments}
       onChange={(e)=>{setCommentData({...commentData,[e.target.name]:e.target.value})}}

       placeholder='Leave comments...'rows={6}/>:""}
       
        <div className='comment-btn'>
        { currentUser && currentUser.userId!=currentUserComment?<button onClick={postComments}>Post Comment</button>:""}
          <button  onClick={closeComments}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Posts
