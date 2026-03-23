import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { message, history } = await req.json();

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemPrompt = "You are Techly AI, an intelligent assistant for a futuristic tech company called Techly. You provide concise, professional, and helpful answers about Techly's digital experience building capabilities. IMPORTANT: You must format your responses to be highly readable and customer-friendly. Use bullet points, numbered lists, and short paragraphs instead of long blocks of text. Always add line breaks to space out your points. You must reply in the exact same language the user speaks to you in. If the user speaks in 'GujLish' (Gujarati written with the English alphabet), you MUST reply in GujLish.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return Response.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return Response.json({ reply: "Sorry, I am facing some connection issues right now." }, { status: 500 });
  }
}
