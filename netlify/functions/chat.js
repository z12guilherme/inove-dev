// Função utilitária para lidar com picos de demanda (Erros 503 e 429) via tentativas automáticas
const fetchWithRetry = async (url, options, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
        const response = await fetch(url, options);
        // Se a requisição foi um sucesso, ou o erro NÃO é de sobrecarga, retorna imediatamente
        if (response.ok || ![429, 503].includes(response.status)) {
            return response;
        }
        if (i === retries) return response; // Esgotou as tentativas

        const waitTime = Math.pow(2, i) * 1000; // Espera 1s, depois 2s...
        console.warn(`⚠️ API sobrecarregada (Erro ${response.status}). Tentativa ${i + 1} de ${retries}. Aguardando ${waitTime / 1000}s...`);
        await new Promise(res => setTimeout(res, waitTime));
    }
};

// Usamos exports.handler (CommonJS) para garantir compatibilidade com o ambiente padrão do Netlify
exports.handler = async (event) => {
    // Adicionando headers CORS para permitir chamadas do frontend
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    try {
        // Aceita requisições preflight do CORS
        if (event.httpMethod === 'OPTIONS') {
            return { statusCode: 200, headers, body: '' };
        }

        // Apenas aceita POST
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, headers, body: JSON.stringify({ error: { message: 'Method Not Allowed' } }) };
        }

        if (!event.body) throw new Error("Corpo da requisição vazio.");

        const body = JSON.parse(event.body);

        // Pega as chaves do ambiente
        let MISTRAL_API_KEY = process.env.MISTRAL_API_KEY ? process.env.MISTRAL_API_KEY.trim() : null;
        // Fallback: Pegando exclusivamente do arquivo .env ou do painel da Netlify
        let GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

        // Define o provedor padrão como Gemini (mais rápido e estável para JSON)
        const provider = body.provider || 'gemini';

        if (provider === 'mistral') {
            if (!MISTRAL_API_KEY) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: { message: "Chave Mistral não configurada." } }) };
            }

            const systemInst = body.messages.find(m => m.role === 'system')?.content || '';
            const userMsg = body.messages.find(m => m.role === 'user')?.content || '';

            try {
                // Verifica se o fetch está disponível (Node 18+ nativo)
                if (!globalThis.fetch) {
                    throw new Error("Fetch API não encontrada. Atualize seu Node.js para v18+ ou instale 'node-fetch'.");
                }

                const response = await fetchWithRetry('https://api.mistral.ai/v1/chat/completions', {
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
                    headers,
                    body: JSON.stringify({
                        choices: data.choices,
                        model_used: "mistral-small-latest"
                    })
                };

            } catch (error) {
                console.error("Erro na API Mistral:", error);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: { message: error.message } })
                };
            }
        }
        else if (provider === 'gemini') {
            if (!GEMINI_API_KEY) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: { message: "Chave Gemini não configurada." } }) };
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

                const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(geminiBody)
                });

                const data = await response.json();

                // Se a API retornar erro (400, 401, 403, 500), mostra o detalhe no terminal
                if (!response.ok) {
                    console.error("❌ Erro retornado pela API do Gemini:", JSON.stringify(data, null, 2));
                    throw new Error(`Erro Gemini (${response.status}): ${data.error?.message || 'Falha na requisição'}`);
                }

                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (!text) {
                    console.error("⚠️ Resposta inesperada do Gemini (Bloqueio de Segurança?):", JSON.stringify(data, null, 2));
                    throw new Error("Gemini não retornou texto. Verifique filtros de segurança ou formato.");
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        choices: [{ message: { content: text } }],
                        model_used: "gemini-2.5-flash"
                    })
                };
            } catch (error) {
                console.error("Erro na API Gemini:", error);
                return { statusCode: 500, headers, body: JSON.stringify({ error: { message: error.message } }) };
            }
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: { message: "Provedor não suportado." } })
            };
        }
    } catch (error) {
        console.error("Erro na Netlify Function:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: { message: error.message } })
        };
    }
};
