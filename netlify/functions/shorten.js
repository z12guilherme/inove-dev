exports.handler = async (event) => {
    // Apenas aceita POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const longUrl = body.url;

        if (!longUrl) {
            return { statusCode: 400, body: JSON.stringify({ error: 'URL é obrigatória' }) };
        }

        // Usa a API do TinyURL (Simples e confiável)
        // Nota: No Node 18+ do Netlify, 'fetch' é nativo.
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        
        if (!response.ok) throw new Error('Falha ao encurtar link');
        
        const shortUrl = await response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ result: shortUrl })
        };
    } catch (error) {
        console.error("Erro no encurtador:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao processar solicitação' })
        };
    }
};