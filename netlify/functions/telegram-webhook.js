exports.handler = async (event) => {
    // O Telegram envia as mensagens via POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);

        // Verifica se é uma mensagem de texto válida
        if (!body.message || !body.message.text) {
            return { statusCode: 200, body: 'OK' };
        }

        const chatId = body.message.chat.id;
        const text = body.message.text.toLowerCase();
        const nome = body.message.from.first_name || "Visitante";
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        let resposta = "";

        // --- LÓGICA DO CHATBOT ---
        if (text === '/start' || text.includes('oi') || text.includes('ola')) {
            resposta = `👋 Olá, *${nome}*!\n\nSou o assistente virtual da *Inove Dev*. Como posso te ajudar hoje?\n\nEscolha uma opção:\n1️⃣ /servicos - Nossas Soluções\n2️⃣ /contato - Falar com Humano\n3️⃣ /sobre - Quem somos`;
        }
        else if (text.includes('1') || text.includes('servico') || text.includes('solucoes')) {
            resposta = `🚀 *Nossas Soluções:*\n\n💻 *Sites & Landing Pages:* Alta conversão e design único.\n🛒 *E-commerce:* Venda online com segurança.\n📱 *Sistemas Web:* Painéis administrativos e automação.\n\nDigite /contato para um orçamento!`;
        }
        else if (text.includes('2') || text.includes('contato') || text.includes('humano')) {
            resposta = `📞 *Fale Conosco:*\n\n📲 *WhatsApp:* (81) 98903-5561\n📧 *Email:* contato@inovedev.com.br\n\nOu preencha o formulário em nosso site!`;
        }
        else if (text.includes('3') || text.includes('sobre')) {
            resposta = `💡 *Inove Dev*\n\nSomos especialistas em transformar ideias em código. Focados em performance, design e resultados.`;
        }
        else {
            // --- INTEGRAÇÃO COM IA (GEMINI) ---
            if (GEMINI_KEY) {
                try {
                    // 1. Avisa ao usuário que está "digitando..." (UX)
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: chatId, action: 'typing' })
                    });

                    // 2. Pergunta para o Gemini
                    const aiReq = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `Você é o assistente virtual sênior da Inove Dev. Seu objetivo é ajudar desenvolvedores e clientes.
                                    Responda de forma técnica, precisa e amigável. Se pedirem código, forneça exemplos formatados.
                                    Contexto da mensagem: ${body.message.text}`
                                }]
                            }]
                        })
                    });

                    const aiData = await aiReq.json();

                    // 3. Pega a resposta da IA
                    if (aiData.candidates && aiData.candidates[0]?.content?.parts[0]?.text) {
                        resposta = aiData.candidates[0].content.parts[0].text;
                    } else {
                        resposta = "Desculpe, minha IA está sobrecarregada no momento. Tente novamente.";
                    }
                } catch (e) {
                    console.error("Erro IA:", e);
                    resposta = "Tive um erro ao processar sua solicitação inteligente.";
                }
            } else {
                resposta = `Desculpe, não entendi. 🤖\n\nSou um bot em treinamento. Tente usar os comandos:\n/servicos, /contato ou /sobre.`;
            }
        }

        // Envia a resposta de volta para o usuário
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: resposta,
                parse_mode: 'Markdown'
            })
        });

        return { statusCode: 200, body: 'OK' };

    } catch (error) {
        console.error("Erro Webhook:", error);
        return { statusCode: 500, body: "Erro interno" };
    }
};