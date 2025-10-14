const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ai = new GoogleGenAI({ apiKey: "AIzaSyDgkjKt4hlBB1KREihoBTcgwTPtvswdI7s" });

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
        interviewer: "hi candidate good afternoon please interview ok tell me something about you state hook ok nice to meet you yeah you can leave now",
        candidate: "hello sir good afternoon sir yeah my name is I am from India I completed my graduations from IIT KGP now I am applying for this job rule s in B.Ed new state hope is used for state management purpose thank you sir thank you"
    });
    console.log(feedback);
}

getFeedback();