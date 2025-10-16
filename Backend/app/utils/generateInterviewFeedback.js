const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateInterviewFeedback(voices) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
            Please evaluate the following interview conversation. Rate the conversation from 1 to 10, where 1 is a poor conversation with minimal engagement or clarity, and 10 is an excellent conversation with strong communication, relevant responses, and a clear understanding of the topic. Provide feedback on the candidate’s performance, highlighting strengths and areas for improvement based on the dialogue.

            Interviewer: ${voices.interviewer}
            Candidate: ${voices.candidate}
        `
    });
    return response.text;
}

module.exports = generateInterviewFeedback;

async function getFeedback() {
    const feedback = await generateInterviewFeedback({
        interviewer: "so hello candidate good afternoon what is your name okay nice to meet you so tell me about you state hook okay thank you you can continue to leave",
        candidate: "good afternoon sir myself ABC I am from India I completed my graduation from Bangalore right now I am working at ABC company as a software developer yeah in Riyadh for state where using you straight hook in the centralised way okay thank you sir"
    });
    console.log(feedback);
}

getFeedback();