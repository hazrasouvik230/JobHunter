const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateJobDescription(jobDetails) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            Generate a professional and detailed job description based on the following details:
            - Job Title: ${jobDetails.title}
            - Company: ${jobDetails.company}
            - Location: ${jobDetails.location}
            - Job Type: ${jobDetails.jobType}
            - Experience Level: ${jobDetails.experienceLevel}
            - Requirements: ${jobDetails.requirements}
            - Salary: ${jobDetails.salary}
        `
    });

    return response.text;
}

module.exports = generateJobDescription;