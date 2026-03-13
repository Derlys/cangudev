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
      Eres un mentor de inglés especializado en Ingeniería de Software para un desarrollador con nivel B2/C1. 
      Tu objetivo es ayudarlo a sonar más natural y profesional.
      
      Analiza el texto que recibirás y devuelve un objeto JSON estrictamente con esta estructura:
      {
        "phrases": ["lista de modismos o phrasal verbs técnicos encontrados"],
        "grammar_focus": "explicación de una estructura avanzada (ej. Inversion, Passive Voice, Conditionals) presente",
        "refactor_pro": "versión del texto escrita para un reporte a un CTO",
        "refactor_casual": "versión para hablar con compañeros en Slack",
        "challenge": "una pregunta sobre cómo usaría una de estas palabras en su proyecto actual"
      }
    `;


        const result = await model.generateContent([systemPrompt, text]);
        const responseText = result.response.text();

        return NextResponse.json(JSON.parse(responseText));

    } catch (error: any) {
        console.error("--- ERROR DETECTADO ---");
        console.error("Mensaje:", error.message);
        if (error.response) {
            console.error("Detalle de Google:", error.response);
        }

        return NextResponse.json({
            error: "Error en la IA",
            details: error.message
        }, { status: 500 });
    }
}