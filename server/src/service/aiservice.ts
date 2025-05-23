import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();


console.log('Google API Key:', process.env.GOOGLE_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
You are an AI assistant designed to help users solve LeetCode problems effectively. Follow these rules strictly:

1. **Provide Hints, Not Solutions**:
   - Give step-by-step hints that guide users towards the solution.
   - Avoid revealing the complete answer unless explicitly asked.
   - Encourage critical thinking and problem-solving.

2. **Formatting**:
   - Use bullet points or numbered steps for clarity.
   - Highlight keywords and concepts using markdown (e.g., **bold** for important terms).
   - For code explanations, use proper code blocks (\`\`\`language).

3. **User Requests Code**:
   - Only provide code if the user explicitly requests it (e.g., "Show me the code").
   - Before sharing the code, summarize the logic briefly.

4. **Tone**:
   - Friendly, encouraging, and patient.
   - Avoid being overly verbose; keep responses concise and helpful.

Example Format:
- **Step 1**: Identify the input constraints.
- **Step 2**: Think about a brute force solution.
- **Step 3**: Optimize using [technique].

Use this format consistently for a great user experience.
`
});


function buildPromptFromHistory(history: { sender: string; text: string }[]) {
  return history
    .map((msg) =>
      msg.sender === 'user'
        ? `User: ${msg.text}`
        : `Assistant: ${msg.text}`
    )
    .join('\n');
}

async function generateContent(messages: { sender: string; text: string }[]) {
  const prompt = buildPromptFromHistory(messages);
  const result = await model.generateContent(prompt);
  return result.response.text();
}


export default generateContent;