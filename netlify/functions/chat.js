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
        let MISTRAL_API_KEY = process.env.MISTRAL_API_KEY ? process.env.MISTRAL_API_KEY.trim() : null;
        // Fallback: Se não achar no env, usa a chave fornecida diretamente (Correção para erro 401 local)
        let GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : 'AIzaSyCGL5FoVxsShJOHu5wtJutKQQEnWSF0T68';

        // Define o provedor padrão como Gemini (mais rápido e estável para JSON)
        const provider = body.provider || 'gemini';

        if (provider === 'mistral') {
            if (!MISTRAL_API_KEY) {
                return { statusCode: 401, body: JSON.stringify({ error: { message: "Chave Mistral não configurada." } }) };
            }

            const systemInst = body.messages.find(m => m.role === 'system')?.content || '';
            const userMsg = body.messages.find(m => m.role === 'user')?.content || '';

            try {
                // Verifica se o fetch está disponível (Node 18+ nativo)
                if (!globalThis.fetch) {
                    throw new Error("Fetch API não encontrada. Atualize seu Node.js para v18+ ou instale 'node-fetch'.");
                }

                const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "mistral-small-latest", // Modelo rápido e eficiente da Mistral
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
                    console.error(`Mistral API Error Body: ${errText}`); // Log detalhado no terminal
                    throw new Error(`Mistral API Error (${response.status}): ${errText}`);
                }

                const data = await response.json();
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        choices: data.choices,
                        model_used: "mistral-small-latest"
                    })
                };

            } catch (error) {
                console.error("Erro na API Mistral:", error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: { message: error.message } })
                };
            }
        } 
        else if (provider === 'gemini') {
            if (!GEMINI_API_KEY) {
                return { statusCode: 401, body: JSON.stringify({ error: { message: "Chave Gemini não configurada." } }) };
            }

            try {
                // Mapeia o formato de mensagens do OpenAI para o formato do Gemini
                const systemMsg = body.messages.find(m => m.role === 'system')?.content;
                const userMsg = body.messages.filter(m => m.role !== 'system').map(m => {
                    return {
                        role: m.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: m.content }]
                    };
                });

                const geminiBody = {
                    contents: userMsg,
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json" // Força resposta JSON estruturada (Ótimo para o Studio)
                    }
                };

                if (systemMsg) {
                    geminiBody.systemInstruction = {
                        parts: [{ text: systemMsg }]
                    };
                }

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(geminiBody)
                });

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!text) {
                    throw new Error("Gemini não retornou texto. Verifique filtros de segurança ou formato.");
                }

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        choices: [{ message: { content: text } }],
                        model_used: "gemini-1.5-flash"
                    })
                };
            } catch (error) {
                console.error("Erro na API Gemini:", error);
                return { statusCode: 500, body: JSON.stringify({ error: { message: error.message } }) };
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
