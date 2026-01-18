const chatWindow = document.getElementById('aiChatWindow');
const input = document.getElementById('aiInput');
const sendBtn = document.getElementById('aiSendBtn');
const clearBtn = document.getElementById('aiClearBtn');

let step = 0;
let userData = { name: "", details: "" };

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('ai-message', sender);
    div.innerHTML = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function updateLastMessage(text) {
    const lastMsg = chatWindow.lastElementChild;
    if (lastMsg && lastMsg.classList.contains('bot')) {
        lastMsg.innerHTML = text;
    } else {
        addMessage(text, 'bot');
    }
}

async function handleUserResponse() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    if (step === 0) {
        userData.name = text;
        userData.details = text;

        addMessage("Iniciando processamento... <span class='typing-indicator'></span>", 'bot');

        try {
            await generateSiteStructure(userData.details);
        } catch (error) {
            console.error(error);
            addMessage("Ops! Tive um problema ao processar sua solicitação. Tente novamente.", 'bot');
            input.disabled = false;
            sendBtn.disabled = false;
        }
    }
}

async function generateSiteStructure(userInput) {
    const progressSteps = [
        "🔍 Analisando seu nicho de mercado...",
        "🧠 Conectando ao Llama 3.3 (70B)...",
        "🎨 Criando Design System exclusivo...",
        "📝 Escrevendo copy persuasiva...",
        "🚀 Finalizando estrutura do código..."
    ];
    let stepIndex = 0;
    const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
            updateLastMessage(`${progressSteps[stepIndex]} <span class='typing-indicator'></span>`);
            stepIndex++;
        }
    }, 2500);

    try {
        // Simula um tempo de "pensamento" para UX (já que o JS local é instantâneo)
        // await new Promise(resolve => setTimeout(resolve, 2000)); // Removido, vamos usar o tempo real da API
        
        updateLastMessage(`🧠 Construindo arquitetura do projeto... <span class='typing-indicator'></span>`);
        
        // --- INTEGRAÇÃO COM GROQ / LLAMA 3 ---
        const systemPrompt = `
        Você é uma IA especialista em Web Design, UX e Copywriting.
        Sua tarefa é gerar um JSON ESTRUTURADO para preencher um template HTML existente na pasta do projeto.
        
        LISTA DE TEMPLATES DISPONÍVEIS (Use EXATAMENTE o ID da pasta para o campo 'templateSource'):
        - Corporativo/Business: "strategy" (Caminho: templates/strategy)
        - Agência/Criativo: "craftivo" (templates/craftivo), "story" (templates/story)
        - Landing Page/Marketing: "leadpage" (templates/leadpage), "comingsoon" (templates/comingsoon)
        - Educação: "learne" (templates/learne)
        - Saúde/Clínica: "medinest" (templates/medinest)
        - Portfólio/Pessoal: "iportfolio" (templates/iportfolio), "folione" (templates/folione), "snapfolio" (templates/snapfolio)

        REGRAS DE OURO:
        1. Responda APENAS com o JSON. Sem markdown, sem explicações.
        2. O campo "templateSource" DEVE ser preenchido com UM dos IDs da lista acima (ex: "medinest").
        3. IMPORTANTE: Varie a escolha do template! Analise o pedido e escolha o que melhor se adapta.
           - Para advogados/consultoria -> strategy
           - Para criativos/designers -> craftivo ou story
           - Para produtos/lançamentos -> leadpage
           - Para médicos -> medinest
           - Para currículos/pessoal -> iportfolio ou folione
        4. As imagens devem ser URLs reais do Unsplash (ex: https://source.unsplash.com/800x600/?keyword).
        5. Todo o conteúdo de texto gerado (títulos, descrições, botões, depoimentos) DEVE ser em Português do Brasil.
        6. Siga estritamente este schema JSON:
        {
            "brandName": "Nome da Empresa",
            "niche": "nicho (ex: saude, tecnologia)",
            "imageKeywords": "keywords em ingles para imagens (ex: office, business)",
            "templateSource": "strategy",
            "colors": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex" },
            "fonts": { "heading": "Font Name (Google Fonts)", "body": "Font Name" },
            "hero": { "title": "Manchete Impactante", "subtitle": "Subtítulo persuasivo", "cta": "Texto do Botão" },
            "about": { "title": "Sobre Nós", "text": "Texto sobre a empresa...", "stats": [{ "number": "100+", "label": "Clientes" }] },
            "services": [{ "title": "Nome do Serviço", "desc": "Descrição curta", "icon": "bi-check-circle" }],
            "features": [{ "title": "Diferencial", "desc": "Descrição", "icon": "bi-star" }],
            "portfolio": [{ "title": "Nome do Projeto", "category": "Categoria" }],
            "testimonials": [{ "text": "Depoimento...", "name": "Nome", "role": "Cargo" }],
            "contact": { "email": "email@exemplo.com", "phone": "(00) 0000-0000", "address": "Endereço", "cta_text": "Falar no WhatsApp" },
            "sectionTitles": { "services": "Serviços", "portfolio": "Projetos", "features": "Por que nós?", "testimonials": "O que dizem", "contact": "Contato" },
            "images": { "hero": "url_unsplash_hero", "about": "url_unsplash_about", "feature": "url_unsplash_feature" },
            "customCss": "body { font-family: 'Open Sans', sans-serif; }",
            "layout": { "headerStyle": "solid", "heroHeight": "full", "heroStyle": "center" }
        }
        `;

        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: 'groq',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userInput }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `Erro HTTP ${response.status}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;
        
        // Limpeza caso a IA mande markdown ```json ... ```
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const siteData = JSON.parse(content);

        clearInterval(progressInterval);
        const timestamp = new Date().getTime();
        const uniqueId = timestamp.toString();

        // Salva com ID único (para persistência) E na chave genérica (para compatibilidade)
        localStorage.setItem(`ai_site_${uniqueId}`, JSON.stringify(siteData));
        localStorage.setItem('aiWebsiteData_v3', JSON.stringify(siteData));

        // Lógica de Link Inteligente
        const templateSlug = siteData.templateSource ? siteData.templateSource.toLowerCase().replace(/[^a-z0-9]/g, '') : 'generic';
        
        // URL de Destino: Prioriza o template nativo com ID único
        const targetUrl = (siteData.templateSource && siteData.templateSource !== 'generic')
            ? `templates/${templateSlug}/index.html?id=${uniqueId}`
            : `generated.html?id=${uniqueId}`;

        addMessage(`
            <strong>Site Gerado!</strong> 🚀<br>
            Projeto exclusivo para <strong>${siteData.brandName}</strong>.<br>
            <ul>
                <li>Estilo Sugerido: <strong>${siteData.templateSource || 'Personalizado'}</strong></li>
                <li>Paleta: <span style="color:${siteData.colors?.primary || '#0d6efd'}">■</span> ${siteData.colors?.primary || '#0d6efd'} e <span style="color:${siteData.colors?.secondary || '#6c757d'}">■</span> ${siteData.colors?.secondary || '#6c757d'}</li>
                <li>Foco: ${siteData.niche || 'genérico'}</li>
                <li>Motor: <strong>Llama 3.3 (70B) via Groq</strong></li>
            </ul>
            <div class="d-grid gap-2 mt-3">
                <!-- Botão Principal (Direto para o Template com ID) -->
                <a href="${targetUrl}" target="_blank" class="btn btn-success btn-sm">
                    <i class="bi bi-window-fullscreen"></i> <strong>Ver Site Gerado (ID: ${uniqueId})</strong>
                </a>
            </div>
        `, 'bot');

    } catch (e) {
        clearInterval(progressInterval);
        console.error("Erro detalhado:", e);
        
        let errorMsg = e.message || "Erro ao gerar o site";
        if (e.message.includes("Failed to fetch")) {
            errorMsg = "Não foi possível conectar ao servidor. Verifique se o 'netlify dev' está rodando no terminal.";
        }

        addMessage(`❌ ${errorMsg} Tente novamente.`, 'bot');
        input.disabled = false;
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener('click', handleUserResponse);
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleUserResponse() });

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        chatWindow.innerHTML = `
            <div class="ai-message bot">
                Olá! Sou a IA da Inove. Posso criar um site completo para você agora mesmo.<br>
                <strong>Qual é o nome do seu negócio e o que você faz?</strong><br>
            </div>
        `;
        input.disabled = false;
        sendBtn.disabled = false;
        input.value = '';
        step = 0;
    });
}

document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const prompt = btn.getAttribute('data-prompt');
        input.value = prompt;
        input.focus();
    });
});

// Código LocalAI removido em favor da API Groq/Llama 3
