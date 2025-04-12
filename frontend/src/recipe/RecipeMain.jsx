import React from 'react'
import RecipeApp from './RecipeApp.jsx'
import './RecipeIndex.css'

const RecipeMain = () => {
  return (
    <div id="root">
      <div className="recipe-main">
        <div className="recipe-page-wrapper">
          <RecipeApp />
        </div>
      </div>
    </div>
  )
}

export default RecipeMain