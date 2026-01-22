exports.handler = async (event) => {
    // Apenas aceita POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const { nome, email, telefone, mensagem } = body;

        // Pegar variáveis de ambiente (Configurar no Netlify)
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            console.error("Erro: Variáveis de ambiente do Telegram não configuradas.");
            return { statusCode: 500, body: JSON.stringify({ error: "Configuração de servidor ausente." }) };
        }

        // Data e Hora formatada (Horário de Brasília)
        const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        // Montar a mensagem formatada
        const text = `
🔔 *Novo Contato pelo Site!*
🕒 *Em:* ${dataHora}

👤 *Nome:* ${nome}
📧 *Email:* ${email}
📞 *Telefone:* ${telefone || "Não informado"}

💬 *Mensagem:*
${mensagem}
        `;

        // Enviar para a API do Telegram
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (!data.ok) {
            throw new Error(`Erro Telegram: ${data.description}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Notificação enviada com sucesso!" })
        };

    } catch (error) {
        console.error("Erro ao enviar telegram:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};