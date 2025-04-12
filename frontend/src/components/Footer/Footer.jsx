import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
        <h1 id='logo-h1'>AskChef</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus totam consequatur assumenda ducimus culpa aut autem aperiam dolorum illum qui, iste deleniti itaque facere numquam incidunt hic labore quos vel?</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon}/>
                <img src={assets.linkedin_icon}/>
                <img src={assets.twitter_icon}/>
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li>Services</li>
                <li>Terms & Conditions</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91 1234567890</li>
                <li>wemei@me.in</li>
            </ul>
        </div>
      </div>
      <hr/>
      <p className="footer-copyright">Copyright 2025 @ meme - All Right Reserved.</p>
    </div>
  )
}

export default Footer
