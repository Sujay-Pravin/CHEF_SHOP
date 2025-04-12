import React from "react";
import ReactMarkdown from "react-markdown";
import './RecipeIndex.css'

export default function ClaudeRecipe(props) {
    return (
        <section className="suggested-recipe-container" aria-live="polite">
            <div id="suggestedCover">
                <div id="listHeadingContainer">
                    <span><h2 id="listHeading">Chef's Recipe:</h2></span>
                </div>
                <ReactMarkdown>{props.recipe}</ReactMarkdown>
            </div>
        </section>
    );
}
