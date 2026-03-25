import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const { message, history } = await req.json();

    const systemPrompt = "You are Techly AI, an intelligent assistant for a futuristic tech company called Techly. You provide concise, professional, and helpful answers about Techly's digital experience building capabilities. IMPORTANT: You must format your responses to be highly readable and customer-friendly. Use bullet points, numbered lists, and short paragraphs instead of long blocks of text. Always add line breaks to space out your points. You must reply in the exact same language the user speaks to you in. If the user speaks in 'GujLish' (Gujarati written with the English alphabet), you MUST reply in GujLish. IMPORTANT: Your reply should strictly follow the history provided.";

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return Response.json({ reply: response.text() });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return Response.json({ reply: "Sorry, I am facing some connection issues right now. Just a reminder to make sure your API key is correctly added into Vercel settings and then redeploy." }, { status: 500 });
  }
}
