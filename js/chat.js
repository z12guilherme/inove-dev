export const handler = async (event) => {
    // Apenas aceita POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Pega a chave segura do ambiente do Netlify
    const API_KEY = process.env.MISTRAL_API_KEY || "otFYtFdY9xu6WD0qQfKUpAIrHV4rSERK";

    if (!API_KEY) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: { message: "Chave Mistral não configurada no servidor." } }) 
        };
    }

    try {
        const body = JSON.parse(event.body);
        // Extrai mensagens do corpo ou usa padrão
        const messages = body.messages || [];

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: messages,
                temperature: 0.7
            })
        });

        const data = await response.json();

        return {
            statusCode: response.status,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: error.message } })
        };
    }
};