// Usamos exports.handler (CommonJS) para garantir compatibilidade com o ambiente padrão do Netlify
exports.handler = async (event) => {
    // Apenas aceita POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Pega a chave segura do ambiente do Netlify
    const API_KEY = process.env.PERPLEXITY_API_KEY;

    if (!API_KEY) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: { message: "Chave de API não configurada no servidor." } }) 
        };
    }

    try {
        const body = JSON.parse(event.body);

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: { message: `Erro na API Perplexity: ${errorText}` } })
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Erro na Netlify Function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: error.message } })
        };
    }
};
