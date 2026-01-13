// Chave da API Perplexity
const API_KEY = "SUA_CHAVE_API_AQUI";

const chatWindow = document.getElementById('aiChatWindow');
const input = document.getElementById('aiInput');
const sendBtn = document.getElementById('aiSendBtn');

let step = 0;
let userData = { name: "", details: "" };

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('ai-message', sender);
    div.innerHTML = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function handleUserResponse() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    if (step === 0) {
        userData.name = text; // Na verdade pegamos tudo junto no primeiro prompt para simplificar
        userData.details = text;
        
        addMessage("Entendi! Estou analisando seu nicho e criando uma estrutura personalizada... <span class='typing-indicator'></span>", 'bot');
        
        try {
            await generateSiteStructure(userData.details);
        } catch (error) {
            console.error(error);
            addMessage("Ops! Tive um problema ao conectar com a IA. Verifique a API Key no código.", 'bot');
            input.disabled = false;
            sendBtn.disabled = false;
        }
    }
}

async function generateSiteStructure(userInput) {
    const systemPrompt = `
    Atue como um Arquiteto de Soluções Web Sênior e Especialista em Copywriting.
    Crie o conteúdo completo para uma Landing Page Premium de alta conversão baseada na descrição do usuário.
    Se a descrição for vaga, crie uma marca fictícia de alto padrão, com nome, identidade visual e textos persuasivos.
    
    Retorne APENAS um objeto JSON válido com a seguinte estrutura detalhada:
    {
        "brandName": "Nome da Empresa",
        "niche": "Nicho de mercado",
        "colors": {
            "primary": "Cor principal HEX (ex: #0D1B2A)",
            "secondary": "Cor secundária HEX",
            "accent": "Cor de destaque/CTA HEX",
            "bg_light": "Cor de fundo claro (ex: #f8f9fa)",
            "text_dark": "Cor de texto escuro (ex: #333)"
        },
        "fonts": {
            "heading": "Nome da fonte Google Fonts para títulos (ex: Playfair Display, Montserrat, Oswald)",
            "body": "Nome da fonte Google Fonts para corpo (ex: Open Sans, Lato, Roboto)"
        },
        "hero": {
            "title": "Headline poderosa e curta",
            "subtitle": "Subtítulo explicativo que gera desejo",
            "cta": "Texto do botão de ação"
        },
        "about": {
            "title": "Sobre Nós / A Empresa",
            "text": "Texto institucional de 3 a 4 linhas, transmitindo autoridade e confiança.",
            "stats": [
                {"number": "10+", "label": "Anos de Mercado"},
                {"number": "500+", "label": "Projetos"},
                {"number": "98%", "label": "Satisfação"}
            ]
        },
        "services": [
            {"title": "Nome do Serviço 1", "desc": "Descrição curta do benefício.", "icon": "bi-star"},
            {"title": "Nome do Serviço 2", "desc": "Descrição curta do benefício.", "icon": "bi-shield-check"},
            {"title": "Nome do Serviço 3", "desc": "Descrição curta do benefício.", "icon": "bi-gem"},
            {"title": "Nome do Serviço 4", "desc": "Descrição curta do benefício.", "icon": "bi-rocket"}
        ],
        "features": [
            {"title": "Diferencial 1", "desc": "Explicação breve."},
            {"title": "Diferencial 2", "desc": "Explicação breve."},
            {"title": "Diferencial 3", "desc": "Explicação breve."}
        ],
        "testimonials": [
            {"name": "Nome do Cliente", "text": "Depoimento curto elogiando o serviço."}
        ],
        "contact": {
            "address": "Endereço Comercial Fictício",
            "email": "contato@empresa.com",
            "phone": "(11) 99999-9999",
            "cta_text": "Solicitar Orçamento"
        },
        "imagePrompts": {
            "hero": "Descrição visual em INGLÊS para o background (ex: cinematic photo of a modern law firm office, warm lighting, 8k)",
            "about": "Descrição visual em INGLÊS para a seção sobre (ex: professional team meeting in a modern office, diverse group, realistic)",
            "feature": "Descrição visual em INGLÊS para a seção de destaque (ex: close up detail of legal documents and a pen, high resolution)"
        }
    }
    `;

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sonar",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userInput }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erro API (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        let text = data.choices[0].message.content;
        
        // Limpeza extra para garantir JSON válido
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }
        
        const siteData = JSON.parse(text);
        
        // Salva no LocalStorage para a página gerada usar
        localStorage.setItem('aiWebsiteData', JSON.stringify(siteData));

        addMessage(`
            <strong>Sucesso!</strong> 🚀<br>
            Criei um projeto exclusivo para <strong>${siteData.brandName}</strong>.<br>
            <ul>
                <li>Paleta: <span style="color:${siteData.colors.primary}">■</span> ${siteData.colors.primary} e <span style="color:${siteData.colors.secondary}">■</span> ${siteData.colors.secondary}</li>
                <li>Foco: ${siteData.niche}</li>
            </ul>
            <div class="text-center mt-3">
                <a href="generated.html" target="_blank" class="btn btn-success btn-sm">
                    <i class="bi bi-magic"></i> Ver Site Gerado
                </a>
            </div>
        `, 'bot');

    } catch (e) {
        console.error("Erro detalhado:", e);
        let errorMsg = "Desculpe, não consegui gerar o site agora.";
        
        // Diagnóstico de erro para o usuário
        if (e.toString().includes('403') || e.toString().includes('API key')) {
            errorMsg = "Erro de Autenticação: Verifique se a API Key é válida e está habilitada no Google Cloud.";
        } else if (e.toString().includes('429')) {
            errorMsg = "Muitas requisições. Aguarde alguns instantes e tente novamente.";
        } else if (e.toString().includes('404')) {
            errorMsg = "Erro 404: Modelo não encontrado ou endpoint incorreto.";
        }

        addMessage(`${errorMsg} Tente novamente com mais detalhes.`, 'bot');
        input.disabled = false;
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener('click', handleUserResponse);
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleUserResponse() });