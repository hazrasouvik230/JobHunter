const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateInterviewFeedback(voices) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            Please evaluate the following interview conversation and provide:
            1. A rating from 1 to 10 (format: X/10)
            2. Brief feedback on the candidate's performance
            
            Focus on communication skills, relevance of responses, and overall engagement.
            
            Interviewer: ${voices.interviewer}
            Candidate: ${voices.candidate}
            
            Please keep the response concise and always include a rating in X/10 format.
        `
    });
    return response.text;
}

module.exports = generateInterviewFeedback;