const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateJobDescription(jobDetails) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            Write a job description for the role of ${jobDetails.title}. 
            
            Company: ${jobDetails.companyName}
            Location: ${jobDetails.location}
            Employment Type: ${jobDetails.jobType}
            Experience Level: ${jobDetails.experienceLevel}
            Requirements: ${jobDetails.requirements}
            Salary: ${jobDetails.salary}

            The job description should include:  
            1. A compelling introduction about the company and why someone would want to work here.  
            2. A clear overview of the role and its importance.  
            3. Key responsibilities (5–8 bullet points).  
            4. Required qualifications and skills (technical + soft skills).  
            5. Preferred qualifications (if any).  
            6. Benefits and perks offered.  
            7. A call-to-action encouraging candidates to apply.  

            Make the tone professional, inclusive, and engaging. Avoid bias. Optimize for readability and clarity.
        `
    });
    return response.text;
}
module.exports = generateJobDescription;