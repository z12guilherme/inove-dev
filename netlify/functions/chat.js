// Usamos exports.handler (CommonJS) para garantir compatibilidade com o ambiente padrão do Netlify
exports.handler = async (event) => {
    try {
        // Apenas aceita POST
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: 'Method Not Allowed' };
        }

        if (!event.body) throw new Error("Corpo da requisição vazio.");

        const body = JSON.parse(event.body);

        // Pega as chaves do ambiente
        const GROQ_API_KEY = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : null;

        if (!GROQ_API_KEY) {
            return { 
                statusCode: 401, 
                body: JSON.stringify({ error: { message: "Chave Groq não configurada no servidor." } }) 
            };
        }

        const provider = body.provider || 'groq';

        if (provider === 'groq') {
            const systemInst = body.messages.find(m => m.role === 'system')?.content || '';
            const userMsg = body.messages.find(m => m.role === 'user')?.content || '';

            try {
                // Verifica se o fetch está disponível (Node 18+ nativo)
                if (!globalThis.fetch) {
                    throw new Error("Fetch API não encontrada. Atualize seu Node.js para v18+ ou instale 'node-fetch'.");
                }

                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile", // Modelo atualizado (Llama 3.3 70B)
                        messages: [
                            { role: "system", content: systemInst },
                            { role: "user", content: userMsg }
                        ],
                        temperature: 0.7,
                        // response_format removido para evitar erro 400 (Bad Request).
                        // O Llama 3 segue bem as instruções do System Prompt para gerar JSON.
                    })
                });

                if (!response.ok) {
                    const errText = await response.text();
                    console.error(`Groq API Error Body: ${errText}`); // Log detalhado no terminal
                    throw new Error(`Groq API Error (${response.status}): ${errText}`);
                }

                const data = await response.json();
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        choices: data.choices,
                        model_used: "llama-3.3-70b-versatile"
                    })
                };

            } catch (error) {
                console.error("Erro na API Groq:", error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: { message: error.message } })
                };
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: { message: "Provedor não suportado." } })
            };
        }
    } catch (error) {
        console.error("Erro na Netlify Function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: { message: error.message } })
        };
    }
};
