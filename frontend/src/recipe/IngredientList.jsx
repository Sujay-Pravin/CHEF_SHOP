import './RecipeIndex.css'

export default function IngredientsList(props) {
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient} <button id = "">x</button></li>
    ))
    
    return (
        <section id="listContainer">
            <div id="centerContent">
                
                <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
                
                {props.ingredients.length > 3 && <div className="get-recipe-container">
                    <button onClick={props.getRecipe} id="getRecipeButton" >Get a recipe</button>
                </div>}
               
            </div>
                
                    
            
        </section>
    )
}