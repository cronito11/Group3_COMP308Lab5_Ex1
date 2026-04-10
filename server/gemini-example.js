require('dotenv').config();
//
// Import the GoogleGenerativeAI class
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the generation configuration
const generationConfig = {
  // The model will stop generating content
  // after it reaches a stop sequence
  stopSequences: ["red"],
  // the maximum number of tokens that can be generated in the response
  maxOutputTokens: 200,
  // The temperature controls the degree of randomness in token selection
  // Lower temperatures are good for prompts that require a more deterministic
  // or less open-ended response
  temperature: 0.9,
  // The topP parameter changes how the model selects tokens for output
  topP: 0.1,
  // The topP parameter changes how the model selects tokens for output
  // Tokens are selected from the most to least probable until the sum of
  // their probabilities equals the topP value
  topK: 16,
};
// Create a generative model
const model = genAI.getGenerativeModel({ model: "MODEL_NAME",  generationConfig });
//
async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  // Define the prompt
  const prompt = "What is Generative AI"
  // Generate content
  const result = await model.generateContent(prompt);
  // Get the response
  const response = await result.response;
  // Get the text from the response
  const text = response.text();
  console.log(text);
}
// Run the function
run();