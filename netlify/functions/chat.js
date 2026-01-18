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
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return { 
                statusCode: 401, 
                body: JSON.stringify({ error: { message: "Chave Gemini não configurada no servidor." } }) 
            };
        }

        const provider = body.provider || 'gemini';

        if (provider === 'gemini') {
            const systemInst = body.messages.find(m => m.role === 'system')?.content || '';
            const userMsg = body.messages.find(m => m.role === 'user')?.content || '';

            // Lista de modelos para tentar em ordem de preferência (Fallback System)
            const modelsToTry = [
                { id: 'gemini-1.5-flash', version: 'v1beta' }, // Tenta Flash no Beta (mais recursos)
                { id: 'gemini-1.5-flash', version: 'v1' },     // Tenta Flash no Stable (se Beta falhar)
                { id: 'gemini-1.5-pro', version: 'v1beta' },    // Tenta Pro 1.5
                { id: 'gemini-pro', version: 'v1' }             // Tenta Pro 1.0 no Stable (Legacy confiável)
            ];

            let lastError = null;

            for (const { id, version } of modelsToTry) {
                try {
                    console.log(`Tentando modelo: ${id} na versão ${version}...`);
                    // Ajusta a versão da API dinamicamente para cada modelo
                    const geminiUrl = `https://generativelanguage.googleapis.com/${version}/models/${id}:generateContent?key=${GEMINI_API_KEY}`;

                    const response = await fetch(geminiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ 
                                role: "user", 
                                parts: [{ text: `CONTEXTO DO SISTEMA: ${systemInst}\n\nPERGUNTA DO USUÁRIO: ${userMsg}\n\nIMPORTANTE: Responda estritamente com um objeto JSON válido.` }] 
                            }],
                            generation_config: {
                                temperature: 0.7
                            }
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        return {
                            statusCode: 200,
                            body: JSON.stringify({
                                choices: [{
                                    message: {
                                        content: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
                                    }
                                }],
                                model_used: id
                            })
                        };
                    } else {
                        const errorText = await response.text();
                        console.warn(`Falha no modelo ${id} (${response.status}): ${errorText}`);
                        lastError = { status: response.status, message: errorText };
                        
                        // Se for erro de autenticação (400/401) e não "Not Found", paramos pois a chave está errada.
                        if (response.status === 400 && !errorText.includes('not found')) break;
                        if (response.status === 401) break;
                    }
                } catch (e) {
                    console.error(`Erro de conexão com ${id}:`, e);
                    lastError = { status: 500, message: e.message };
                }
            }
            
            return {
                statusCode: lastError ? lastError.status : 500,
                body: JSON.stringify({ error: { message: `Falha em todos os modelos. Último erro: ${lastError?.message}` } })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: { message: "Provedor não suportado. Apenas Gemini está ativo." } })
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
