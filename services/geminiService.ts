
import { GoogleGenAI, Type } from "@google/genai";
import { TestQuestion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            description: "The question text."
        },
        options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers.",
            items: {
                type: Type.STRING
            }
        },
        correctAnswerIndex: {
            type: Type.INTEGER,
            description: "The 0-based index of the correct answer in the options array."
        },
    },
    required: ["question", "options", "correctAnswerIndex"]
};

/**
 * Generates a specified number of test questions for a given course using the Gemini API.
 * @param courseName The name of the course to generate questions for.
 * @param numberOfQuestions The number of questions to generate.
 * @returns A promise that resolves to an array of TestQuestion objects.
 */
export const generateQuestions = async (courseName: string, numberOfQuestions: number): Promise<TestQuestion[]> => {
    try {
        const prompt = `Generate ${numberOfQuestions} difficult, professional-level multiple-choice questions for an advanced course on "${courseName}".
        Each question must have exactly 4 plausible options and a single correct answer.
        The questions should be suitable for a skills assessment test for professionals.
        Ensure the 'correctAnswerIndex' is a number from 0 to 3.
        The options array must contain exactly 4 string elements.
        Return the response as a JSON array of objects.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: questionSchema
                },
            },
        });

        const responseText = response.text.trim();
        if (!responseText) {
            throw new Error("Received an empty response from the AI. Please try again.");
        }

        const generatedQuestions: TestQuestion[] = JSON.parse(responseText);

        if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
            throw new Error("AI response was not a valid array of questions.");
        }

        const sample = generatedQuestions[0];
        if (typeof sample.question !== 'string' || !Array.isArray(sample.options) || typeof sample.correctAnswerIndex !== 'number') {
             throw new Error("The format of the generated questions is incorrect.");
        }

        return generatedQuestions;

    } catch (error) {
        console.error("Error generating questions with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`AI generation failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred during AI question generation.");
    }
};

/**
 * Provides career advice using the Gemini API.
 * @param userQuery The user's question about their career.
 * @returns A promise that resolves to a string containing career advice.
 */
export const getCareerAdvice = async (userQuery: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userQuery,
            config: {
                systemInstruction: "You are a friendly and encouraging AI career counselor for AI4S Solutions. You specialize in SAP careers. Provide clear, concise, and helpful advice. Keep responses to a few paragraphs. Use markdown for formatting like lists or bold text if it improves readability.",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error getting career advice from Gemini:", error);
        throw new Error("Failed to fetch career advice from AI service.");
    }
};


/**
 * Generates personalized study tips based on a student's incorrect answers.
 * @param course The course the student is taking.
 * @param wrongAnswers An array of objects detailing the questions the student got wrong.
 * @returns A promise that resolves to a string of formatted study tips.
 */
export const getStudyTips = async (course: string, wrongAnswers: { question: string; studentAnswer: string; correctAnswer: string }[]): Promise<string> => {
    const prompt = `
        You are an expert SAP instructor. A student is studying for a course on "${course}".
        They answered the following questions incorrectly. Based on their mistakes, provide 3-5 specific, actionable study tips to help them improve.
        
        Here are their mistakes:
        ${wrongAnswers.map(wa => `
        - Question: "${wa.question}"
          - Their incorrect answer: "${wa.studentAnswer}"
          - The correct answer was: "${wa.correctAnswer}"
        `).join('\n')}

        Frame your response in a positive and encouraging tone. Start with a brief encouraging sentence. Then, provide the tips as a numbered list in markdown.
        Focus on the underlying concepts they might be misunderstanding.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting study tips from Gemini:", error);
        throw new Error("Failed to fetch study tips from AI service.");
    }
};
