import React from 'react';
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromLLaMA } from "./ai";
import loader from './assets/loader.gif';
import './RecipeIndex.css'

let z = 0;

function IngredientsList(props) {
  const ingredientsListItems = props.ingredients.map((ingredient, index) => (
    <li key={index}>{ingredient} <button onClick={() => props.removeIngredient(index)} id = "rmbtn">x</button></li>
  ));


  return (
    <section id="listContainer">
      <div id="centerContent">
        <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
        {props.ingredients.length > 3 && (
          <div className="get-recipe-container">
            <button onClick={props.getRecipe} id="getRecipeButton">Get a recipe</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function InputForm() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [btnClick, setBtnClick] = React.useState(false);

  async function getRecipe() {
    z = 1;
    setLoading(true);
    setBtnClick(prev => !prev);
    const recipeMarkdown = await getRecipeFromLLaMA(ingredients);
    setRecipe(recipeMarkdown);
    setLoading(false);
  }

  function addIngredient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient");
    setIngredients(prev => [...prev, newIngredient]);
    event.target.reset();
  }

  function removeIngredient(index) {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <section id="formSection">
      <div id="bodyHeader" style={{display:z==1?"none":"block"}}>
        <h1 id="bodyHeaderh1"><span id="cookSmarter">Cook smarter</span>, not harder</h1>
        <div id="bodyHeaderItem">
          <h3>Not sure what to cook tonight?</h3>
          <p>Unleash the culinary artist within with our AI-powered recipes!</p>
        </div>
      </div>
      {loading && (
        <div className="spinner">
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
        </div>
      )}
      {recipe && !loading && <ClaudeRecipe recipe={recipe} />}
      {ingredients.length > 0 && (
        <IngredientsList ingredients={ingredients} getRecipe={getRecipe} removeIngredient={removeIngredient} btnState={btnClick} />
      )}
      <form onSubmit={addIngredient} className="add-ingredient-form">
        <input type="text" placeholder="e.g. oregano" aria-label="Add ingredient" name="ingredient" required />
        <button type="submit">Add ingredient</button>
      </form>
    </section>
  );
}
