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
    Atue como um Arquiteto de Soluções Web Sênior e Especialista em UX/UI.
    Sua missão é criar o JSON estruturado para um projeto web.
    
    PRIMEIRO, DECIDA O TIPO DE PROJETO COM BASE NO PEDIDO:
    1. "landing": Se for site institucional, landing page, portfólio, loja virtual (vitrine).
    2. "system": Se for sistema de gestão, ERP, CRM, dashboard, painel administrativo, controle de estoque, financeiro.
    
    ESTRUTURA JSON PARA "landing":
    {
        "projectType": "landing",
        "brandName": "Nome da Empresa",
        "niche": "Nicho de mercado",
        "themeStyle": "modern | classic | minimalist | bold | luxury",
        "layout": { "heroStyle": "center", "cardStyle": "shadow", "borderRadius": "rounded" },
        "colors": {
            "primary": "#HEX", "secondary": "#HEX", "accent": "#HEX", 
            "background": "#HEX", "text": "#HEX", "card_bg": "#HEX"
        },
        "fonts": {
            "heading": "FontName", "body": "FontName"
        },
        "hero": { "title": "Headline", "subtitle": "Subhead", "cta": "Button Text" },
        "about": { "title": "Sobre", "text": "Texto", "stats": [{"number": "10", "label": "Anos"}] },
        "services": [{"title": "Serviço", "desc": "Desc", "icon": "bi-star"}],
        "features": [{"title": "Feature", "desc": "Desc"}],
        "portfolio": [{"title": "Proj", "category": "Cat", "desc": "Desc"}],
        "testimonials": [{"name": "Cliente", "text": "Depoimento"}],
        "contact": { "address": "Endereço", "email": "Email", "phone": "Tel", "cta_text": "CTA" },
        "customCss": "Regras CSS específicas para forçar o layout escolhido (ex: header { justify-content: center; } .hero-text { text-align: center; })",
        "imageKeywords": {
            "hero": "prompt", "about": "prompt", "feature": "prompt", "portfolio": "prompt"
        }
    }

    ESTRUTURA JSON PARA "system":
    {
        "projectType": "system",
        "brandName": "Nome do Sistema",
        "themeColor": "#HEX (Cor Principal)",
        "sidebarItems": [
            {"label": "Dashboard", "icon": "bi-grid"},
            {"label": "Menu 2", "icon": "bi-box"}
        ],
        "stats": [
            {"label": "KPI 1", "value": "100", "icon": "bi-graph-up", "trend": "+10%", "color": "primary"},
            {"label": "KPI 2", "value": "50", "icon": "bi-people", "trend": "-5%", "color": "danger"},
            {"label": "KPI 3", "value": "R$ 1k", "icon": "bi-wallet", "trend": "+2%", "color": "success"},
            {"label": "KPI 4", "value": "10", "icon": "bi-bell", "trend": "0%", "color": "warning"}
        ],
        "charts": {
            "line": { "title": "Gráfico de Linha (ex: Vendas)", "labels": ["Jan", "Fev", "Mar", "Abr"], "data": [10, 20, 15, 30] },
            "doughnut": { "title": "Gráfico de Rosca (ex: Categorias)", "labels": ["A", "B", "C"], "data": [30, 50, 20] }
        },
        "table": {
            "title": "Listagem Principal",
            "columns": ["ID", "Coluna 2", "Coluna 3", "Status"],
            "rows": [
                {"col1": "#001", "col2": "Dado A", "col3": "Dado B", "col4": "Ativo"},
                {"col1": "#002", "col2": "Dado C", "col3": "Dado D", "col4": "Pendente"}
            ]
        }
    }

    REGRAS ESTRITAS:
    1. Retorne APENAS o JSON cru.
    2. Use aspas duplas.
    3. NÃO use vírgulas no final de listas.
    4. Escape aspas internas.
    5. Para imagens, use prompts descritivos em inglês.
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
        
        const timestamp = new Date().getTime(); // Cria um código único para evitar cache
        
        if (siteData.projectType === 'system') {
            // Lógica para SISTEMAS
            localStorage.setItem('aiSystemData', JSON.stringify(siteData));
            addMessage(`
                <strong>Sistema Gerado!</strong> 🖥️<br>
                Configurei o painel administrativo para <strong>${siteData.brandName}</strong>.<br>
                <div class="text-center mt-3">
                    <a href="generated-system.html?v=${timestamp}" target="_blank" class="btn btn-primary btn-sm">
                        <i class="bi bi-speedometer2"></i> Acessar Sistema
                    </a>
                </div>
            `, 'bot');
        } else {
            // Lógica para LANDING PAGES (Padrão)
            localStorage.setItem('aiWebsiteData_v3', JSON.stringify(siteData));
            addMessage(`
                <strong>Site Gerado!</strong> 🚀<br>
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
        }

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