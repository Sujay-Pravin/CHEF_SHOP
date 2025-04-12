import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with your API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getRecipeFromLLaMA(ingredients) {
  try {
    if (!ingredients || ingredients.length === 0) {
      throw new Error('No ingredients provided');
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-8b",
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });

    // Construct the prompt with better formatting
    const prompt = `As a professional chef, create a recipe using these ingredients: ${ingredients.join(', ')}.

Please provide the recipe in the following markdown format:

# Recipe Name

## Ingredients
[List ingredients with quantities]

## Instructions
[Step by step numbered instructions]

## Details
- Cooking Time: [time]
- Difficulty Level: [easy/medium/hard]

## Tips
[Additional cooking tips and suggestions]`;

    // Generate content with safety settings
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating recipe:", error);
    if (error.message.includes('API key')) {
      return "Error: Invalid API key. Please check your configuration.";
    }
    return "Sorry, I couldn't generate a recipe at this time. Please try again later.";
  }
}

