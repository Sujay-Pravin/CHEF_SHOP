import React, { useState,useEffect, useContext } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"


const LoginPopup = ({setShowLogin}) => {

  const {url,token,setToken} = useContext(StoreContext)

    const [currState, setcurrState] = React.useState('Login')
    const [data,setData] = useState({
      name:"",
      email:"",
      password:""
    })

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (event) => {
      event.preventDefault()
      let newUrl = url;
      if(currState==="Login"){
        newUrl += "/api/user/login"
      }
      else{
        newUrl += "/api/user/register"
      }

      const response = await axios.post(newUrl,data)

      if(response.data.success){
        setToken(response.data.token);
        localStorage.setItem("token",response.data.token)
        setShowLogin(false)
      }
      else{
        alert(response.data.message)
      }

    }


  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} action="" className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img src={assets.cross_icon} onClick={() => setShowLogin(false )}/>
        </div>
        <div className="login-popup-inputs">
            {currState==="Sign Up"?<input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Your name' required />:<></>}
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Your password' required />
        </div>
        <button type="submit">{currState==="Sign Up"?"Create account":"Login"}</button>

        {currState==="Sign Up"?<div className="login-popup-condition">
            <input type="checkbox" required />
            <p>I agree to the terms and conditions</p>
        </div>:<></>}
        {currState==="Login"? <p>Create a new account? <span onClick={() => setcurrState("Sign Up")}>Click here</span></p>:
        <p>Already have an account? <span onClick={() => setcurrState("Login")}>Login here</span></p>}
       
        
       </form>
    </div>
  )
}

export default LoginPopup
