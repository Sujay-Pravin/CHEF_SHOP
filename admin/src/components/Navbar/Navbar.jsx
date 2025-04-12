import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <h1 id='logo-h1'>AskChef</h1>
      <img src={assets.add_icon} alt="" className="profile" />
    </div>
  )
}

export default Navbar
