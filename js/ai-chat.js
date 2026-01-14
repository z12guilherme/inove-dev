// Importa a chave do arquivo de configuração (que está ignorado pelo Git)
import { API_KEY } from './config.js';

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
    Sua missão é criar o JSON estruturado para uma Landing Page Premium de alta conversão.
    
    DIRETRIZES DE DESIGN E DIVERSIFICAÇÃO:
    1. Adapte radicalmente as cores, fontes E LAYOUT ao nicho.
    2. NÃO use sempre o mesmo layout (ex: Hero centralizado). VARIE entre alinhamento à esquerda, direita ou centro.
    3. CONTRASTE É VITAL: Se o fundo for escuro, o texto TEM QUE SER CLARO. Se o fundo for claro, o texto TEM QUE SER ESCURO.
    3. Use o campo 'customCss' para criar identidades visuais únicas (bordas arredondadas vs quadradas, sombras vs flat).
    4. Se a descrição for vaga, invente uma marca criativa e única.
    5. COPYWRITING: Use gatilhos mentais, textos persuasivos e evite linguagem genérica ("Lorem Ipsum" PROIBIDO).
    6. IMAGENS: As keywords devem ser em INGLÊS e específicas para buscar fotos reais de alta qualidade.
    
    IMPORTANTE: Retorne APENAS o JSON cru. Não use Markdown, não use blocos de código. Comece com { e termine com }.
    REGRAS ESTRITAS DE JSON:
    1. Use APENAS aspas duplas (") para chaves e valores.
    2. NÃO inclua URLs de imagens no JSON, apenas descrições visuais (prompts).
    2. NUNCA use vírgula no final do último item de uma lista ou objeto.
    3. ESCAPE todas as aspas duplas dentro de textos (ex: "texto com \"aspas\"").
    4. NÃO use quebras de linha reais dentro de strings. Use \\n.
    
    Estrutura do JSON:
    {
        "brandName": "Nome da Empresa",
        "niche": "Nicho de mercado",
        "themeStyle": "modern | classic | minimalist | bold | luxury",
        "layout": {
            "heroStyle": "center | left | right",
            "cardStyle": "shadow | border | flat",
            "borderRadius": "rounded | sharp | pill"
        },
        "colors": {
            "primary": "Cor principal HEX (escolha baseada na psicologia das cores do nicho)",
            "secondary": "Cor secundária HEX",
            "accent": "Cor de destaque/CTA HEX",
            "background": "Cor de fundo da página HEX (Pode ser Dark ou Light, mas deve contrastar com o texto)",
            "text": "Cor do texto principal HEX (Alto contraste com o background)",
            "card_bg": "Cor de fundo dos cards/caixas HEX (Ligeiramente diferente do background para destaque)"
        },
        "fonts": {
            "heading": "Nome da fonte Google Fonts que combine com o estilo (ex: Playfair Display, Montserrat, Oswald, Merriweather, Poppins)",
            "body": "Nome da fonte Google Fonts legível (ex: Open Sans, Lato, Roboto, Inter)"
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
        "portfolio": [
            {"title": "Nome do Projeto 1", "category": "Categoria (ex: Web, App)", "desc": "Breve descrição"},
            {"title": "Nome do Projeto 2", "category": "Categoria", "desc": "Breve descrição"},
            {"title": "Nome do Projeto 3", "category": "Categoria", "desc": "Breve descrição"}
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
        "customCss": "Regras CSS específicas para forçar o layout escolhido (ex: header { justify-content: center; } .hero-text { text-align: center; })",
        "imageKeywords": {
            "hero": "Descrição visual detalhada em Inglês para gerar uma imagem de fundo photorealistic (ex: modern luxury office with glass walls, cinematic lighting, 8k, sunset)",
            "about": "Descrição visual em Inglês para a seção sobre (ex: professional team working in a modern office, diverse group, smiling)",
            "feature": "Descrição visual em Inglês para o destaque (ex: close up of a futuristic technology device, glowing blue lights)",
            "portfolio": "Descrição visual em Inglês para os projetos (ex: web design mockup on a laptop screen, minimalist style)"
        }
    }
    `;

    if (!API_KEY || API_KEY === '') {
        addMessage("⚠️ <strong>Configuração Necessária:</strong><br>Você precisa adicionar sua chave de API no arquivo <code>js/config.js</code> para que eu possa funcionar.<br>Abra o arquivo e coloque sua chave.", 'bot');
        return;
    }

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sonar-pro", 
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userInput + "\n\n(Gere o JSON completo agora. Se a descrição for pouca, invente dados profissionais.)" }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erro API (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        let text = data.choices[0].message.content;
        
        console.log("🤖 Resposta Bruta da IA:", text); // Log para debug: Veja no Console (F12) o que a IA retornou

        // Limpeza extra para garantir JSON válido
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        
        if (start === -1 || end === -1) {
            throw new Error(`A resposta da IA não contém um JSON válido. Recebido: ${text.substring(0, 50)}...`);
        }
        
        text = text.substring(start, end + 1);
        
        let siteData;
        try {
            siteData = JSON.parse(text);
        } catch (e) {
            console.warn("JSON inválido detectado. Tentando corrigir...", e);
            try {
                // 1. Remove vírgulas finais (trailing commas)
                let fixedText = text.replace(/,(\s*[}\]])/g, '$1');
                // 2. Tenta corrigir chaves sem aspas (ex: key: "value" -> "key": "value")
                fixedText = fixedText.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
                
                siteData = JSON.parse(fixedText);
            } catch (e2) {
                console.error("Falha na correção automática do JSON:", e2);
                throw e; // Lança o erro original para o catch principal tratar
            }
        }
        
        // Salva no LocalStorage para a página gerada usar
        localStorage.setItem('aiWebsiteData', JSON.stringify(siteData));

        const timestamp = new Date().getTime(); // Cria um código único para evitar cache
        addMessage(`
            <strong>Sucesso!</strong> 🚀<br>
            Criei um projeto exclusivo para <strong>${siteData.brandName}</strong>.<br>
            <ul>
                <li>Paleta: <span style="color:${siteData.colors.primary}">■</span> ${siteData.colors.primary} e <span style="color:${siteData.colors.secondary}">■</span> ${siteData.colors.secondary}</li>
                <li>Foco: ${siteData.niche}</li>
            </ul>
            <div class="text-center mt-3">
                <a href="generated.html?v=${timestamp}" target="_blank" class="btn btn-success btn-sm">
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

// Lógica para os botões de sugestão
document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        input.value = prompt;
        input.focus();
        // Opcional: Clicar automaticamente no enviar se desejar
        // handleUserResponse();
    });
});