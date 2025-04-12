import React from 'react'
import './AppDownLoad.css'
import { assets } from '../../assets/assets'
const AppDownLoad = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br/><code>THIS APP</code> </p>
      <div className="app-download-platforms">
        <img src={assets.play_store}/>
        <img src={assets.app_store}/>
      </div>
    </div>
  )
}

export default AppDownLoad
