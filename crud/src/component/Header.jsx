import React from 'react'
import "../css/header.css"
import { FaBars } from "react-icons/fa";

const Header = ({handleOpenSideBar}) => {
  return (
    <div className='header'>
        <span className='nav-btn'><FaBars onClick={handleOpenSideBar}/></span>
        Posts
    </div>
  )
}

export default Header
