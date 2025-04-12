import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'


const Navbar = ({setShowLogin}) => {

  const [menu,setmenu] = React.useState("home")

  const {getTotalCartAmount,token,setToken} = React.useContext(StoreContext)


  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }

  return (
    <div className={`navbar ${menu === "recipe" ? "transparent" : ""}`}>
      <Link to='/'onClick={() => setmenu("home")}><h1 id='logo-h1'>AskChef</h1></Link>
      {menu !== "recipe" && (
        <>
          <ul className='navbar-menu'>
            <Link to='/' href='#explore-menu' onClick={() => setmenu("home")} className={menu==="home"?"active":""}>home</Link>
            <a href='/#explore-menu' onClick={() => setmenu("menu")} className={menu==="menu"?"active":""}>menu</a>
            <a href='/#app-download' onClick={() => setmenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</a>
            <a href='/#footer' onClick={() => setmenu("contact-us")} className={menu==="contact-us"?"active":""}>contact-us</a>
            <Link to='/recipe' onClick={() => setmenu("recipe")} className={menu==="recipe"?"active":""}>Get-Recipe</Link>
          </ul>
          <div className='navbar-right'>
            
            
            <div className='navbar-search-icon'>
              <Link to='/cart'><img src={assets.basket_icon} alt=''/></Link>
              <div className={getTotalCartAmount()===0?"":"dot"}></div>
            </div>
            {!token ? null : 
              <div className='navbar-profile'>
                <img src={assets.profile_icon} alt='' />
                <ul className='nav-profile-dropdown'>
                  <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt=''/><p>Orders</p></li>
                  <hr/>
                  <li onClick={logout}><img src={assets.logout_icon} alt=''/><p>Logout</p></li>
                </ul>
              </div>
            }
          </div>
        </>
      )}
      {!token && <button id='sign-in' onClick={() => setShowLogin(true)}>sign in</button>}
    </div>
  )
}

export default Navbar
