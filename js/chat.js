exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const messages = body.messages || [];
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: "API Key não configurada no Netlify" }) };
        }

        // Extrai o prompt do sistema e do usuário
        const systemMsg = messages.find(m => m.role === 'system')?.content || "Você é um assistente útil.";
        const userMsg = messages.find(m => m.role === 'user')?.content || "";

        // Chama a API do Gemini 1.5 Flash (Rápida e eficiente)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: userMsg }]
                }],
                systemInstruction: {
                    parts: [{ text: systemMsg }]
                },
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Erro na API do Gemini");
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Retorna no formato que o frontend espera
        return { statusCode: 200, body: JSON.stringify({ choices: [{ message: { content: aiText } }] }) };

    } catch (error) {
        console.error("Erro na Function Chat:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};