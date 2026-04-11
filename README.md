# Group3 COMP308 Lab 5 - Environmental Initiative Summarizer

This project is a full-stack AI summarizer and Q&A assistant focused on:

- The environmental impact of emerging technologies
- Sustainable initiatives from major software makers

The app uses:

- A React UI (`client`)
- A Node.js/Express API (`server`)
- Gemini (via LangChain Google GenAI) for response generation
- Local text knowledge files for retrieval augmentation

## 1. Recent Articles and Official Sources (Up-to-Date)

The following official sources were selected as the primary references for 2025 sustainability initiatives:

1. Microsoft Sustainability
   - https://www.microsoft.com/en-us/corporate-responsibility/sustainability

2. Google Sustainability
   - https://sustainability.google/

Why these sources were selected:

- They are official first-party sustainability portals.
- They contain the latest annual updates, progress metrics, and strategic initiatives.
- They provide concrete, report-backed details suitable for evidence-based summarization.

## 2. Summarizer Implementation Process

This project implements a lightweight Retrieval-Augmented Generation (RAG-style) workflow.

### 2.1 Data Preparation

- Source summaries and report findings are stored in:
  - `server/data/environmental_impact.txt`
  - `server/data/sustainable_solutions.txt`
- Content includes Microsoft and Google 2025 sustainability report highlights.

### 2.2 Backend Pipeline (`server/server.js`)

The API endpoint is `POST /api/query`.

Process flow:

1. Validate input
   - Requires `query`
   - Accepts `type` as either:
     - `environmental_impact`
     - `sustainable_solutions`

2. Load selected knowledge file
   - Uses LangChain `TextLoader` to load the target text document.

3. Retrieve best-matching context
   - Tokenizes user query and candidate lines (`natural.WordTokenizer`).
   - Scores each line by token overlap.
   - Picks the highest-scoring sentence as retrieved context.

4. Augment prompt and generate answer
   - Builds an augmented prompt: user query + retrieved fact.
   - Sends prompt to Gemini model (`gemini-2.5-flash-lite`) and returns generated response.

### 2.3 Frontend UI Process (`client/src/App.jsx`)

- User selects topic type (environmental impact or sustainable solutions).
- User enters a question and submits.
- UI sends request to `http://localhost:3000/api/query`.
- UI displays generated response in a read-only text area.
- Query history (last 10 prompts) is stored in component state for quick reuse.

## 3. Article Selection Process Documentation

To keep findings current and relevant, the selection process used:

1. Authority filter
   - Prioritize official corporate sustainability pages (Microsoft and Google).

2. Recency filter
   - Focus on 2025 report-era information and latest published initiative updates.

3. Relevance filter
   - Keep content directly tied to software/AI sustainability topics:
     - datacenter energy and water use
     - AI efficiency
     - decarbonization programs
     - circular economy practices
     - resilience tools (flood/wildfire systems)

4. Evidence filter
   - Keep measurable outcomes (for example emissions reduction, energy efficiency, water replenishment).

## 4. How to Run the Summarizer Code and UI

## Prerequisites

- Node.js 18+ recommended
- npm
- A valid Google API key for Gemini

## 4.1 Install Dependencies

From project root:

```bash
cd server
npm install

cd ../client
npm install
```

## 4.2 Configure Environment Variables

Create or update `server/.env` with:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

## 4.3 Run Backend and Frontend

Option A (Windows one-click):

```bat
start-dev.bat
```

Option B (manual):

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## 4.4 Access the Application

- API base URL: `http://localhost:3000`
- UI URL (Vite default): `http://localhost:5173`

## 5. Suggested Demo Questions

Use these prompts to demonstrate summarizer behavior:

1. "Please provide a one-page summary for the Impact of Emerging Technologies to the environment"
1. "How do Microsoft and Google balance AI growth with sustainability goals?"
1. "What sustainable solutions are software makers using to reduce emissions?"
1. "How does AI help with wildfire and flood resilience?"
1. "What are the environmental costs of scaling AI infrastructure?"

## 6. Project Structure

```text
Group3_COMP308Lab5_Ex1/
├─ start-dev.bat
├─ client/
│  ├─ src/
│  │  └─ App.jsx
│  └─ package.json
└─ server/
   ├─ server.js
   ├─ .env
   ├─ package.json
   └─ data/
      ├─ environmental_impact.txt
      ├─ sustainable_solutions.txt
      └─ info.txt
```
