import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import natural from "natural";
import { TextLoader } from "langchain/document_loaders/fs/text";

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// AI Model Configuration
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  maxOutputTokens: 2048,
  maxRetries: 0,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

const tokenizer = new natural.WordTokenizer();
const TYPE_TO_DOCUMENT = {
  environmental_impact: "./data/environmental_impact.txt",
  sustainable_solutions: "./data/sustainable_solutions.txt",
};

function resolveType(type) {
  return type || "environmental_impact";
}

function isValidType(type) {
  return Object.prototype.hasOwnProperty.call(TYPE_TO_DOCUMENT, type);
}

// Step 1: Load documents
async function loadDocuments(type) {
  const resolvedType = resolveType(type);
  const filePath = TYPE_TO_DOCUMENT[resolvedType];

  try {
    const loader = new TextLoader(filePath);
    const docs = await loader.load();
    return docs;
  } catch (error) {
    throw new Error(
      `Failed to load document for type '${resolvedType}' from ${filePath}: ${error.message}`,
    );
  }
}

// Step 2: Retrieve data
async function retrieveData(query, documents) {
  const queryTokens = tokenizer.tokenize(query.toLowerCase());
  let bestMatch = null;
  let highestScore = 0;

  documents.forEach((document) => {
    if (!document || !document.pageContent) return;
    const sentences = document.pageContent
      .split(/[\r\n]+/)
      .filter((line) => line.trim() !== "");
    sentences.forEach((sentence) => {
      let sentenceTokens = tokenizer.tokenize(sentence.toLowerCase());
      let intersection = sentenceTokens.filter((token) =>
        queryTokens.includes(token),
      );
      let score = intersection.length;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = sentence;
      }
    });
  });

  console.log("Best match:", bestMatch);
  return bestMatch || "No relevant information found.";
}

// Step 3: Handle user queries
app.post("/api/query", async (req, res) => {
  const { query, type } = req.body;
  const resolvedType = resolveType(type);
  console.log("Received query:", query, "Type:", resolvedType);

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  if (!isValidType(resolvedType)) {
    return res.status(400).json({
      error:
        "Invalid type. Allowed values are: environmental_impact, sustainable_solutions",
    });
  }

  try {
    // Load documents
    const documents = await loadDocuments(resolvedType);

    // Retrieve the most relevant data
    const retrievedData = await retrieveData(query, documents);

    // Augment the query with retrieved data
    const augmentedQuery = retrievedData
      ? `${query} Considering the following fact: ${retrievedData}`
      : query;

    console.log("Augmented query:", augmentedQuery);

    // Generate response using Gemini
    const response = await model.invoke([["human", augmentedQuery]]);
    console.log("Generated response:", response.content);

    res.json({ response: response?.content || "No response generated." });
  } catch (error) {
    console.error("Error generating response:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
