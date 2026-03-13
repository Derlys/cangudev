import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            generationConfig: { responseMimeType: "application/json" }
        });

        const systemPrompt = `
  Eres un mentor de inglés técnico. 
  DEBES generar contenido creativo y educativo incluso si el texto del usuario es corto.
  
  Devuelve SIEMPRE este formato JSON con datos reales (NUNCA campos vacíos):
  {
    "phrases": ["at least 3 technical idioms"],
    "grammar_focus": "a detailed explanation",
    "refactor_pro": "a very formal version",
    "refactor_casual": "a cool slack version",
    "challenge": "a question"
  }
`;
        const result = await model.generateContent([systemPrompt, text]);


        let rawResponse = result.response.text();


        rawResponse = rawResponse.replace(/```json|```/g, "").trim();

        console.log("Respuesta lista para parsear:", rawResponse);


        const parsedData = JSON.parse(rawResponse);
        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error("--- ERROR DETECTADO ---");
        console.error("Mensaje:", error.message);

        return NextResponse.json({
            error: "Error en la IA",
            details: error.message
        }, { status: 500 });
    }
}