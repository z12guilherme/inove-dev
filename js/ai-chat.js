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
        userData.name = text; // Na verdade pegamos tudo junto no primeiro prompt para simplificar
        userData.details = text;
        
        addMessage("Iniciando processamento... <span class='typing-indicator'></span>", 'bot');
        
        try {
            // Chama a função de geração (agora usando Proxy/Groq)
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
    Sua missão é criar o JSON estruturado para um projeto web moderno e responsivo.
    
    OBJETIVO VISUAL:
    O design DEVE ser de altíssima qualidade, visualmente impactante e comparável aos melhores templates Premium do BootstrapMade (ex: 'Arsha', 'HeroBiz', 'Gp', 'OnePage', 'Day').
    Não se limite ao básico. Use sombras suaves (box-shadow), gradientes modernos, bordas arredondadas e tipografia elegante através do campo 'customCss'.
    
    PRIMEIRO, DECIDA O TIPO DE PROJETO COM BASE NO PEDIDO:
    1. "landing": Se for site institucional, landing page, portfólio, loja virtual (vitrine).
    2. "system": Se for sistema de gestão, ERP, CRM, dashboard, painel administrativo, controle de estoque, financeiro.
    
    SELEÇÃO DE TEMPLATE (templateSource):
    Você DEVE selecionar um dos templates abaixo para servir de base estrutural. O sistema carregará o HTML da pasta templates/.
    Analise o pedido do usuário e defina o campo "templateSource" com uma das opções:
    
    - "generic": (Caminho: templates/generic/) -> Use para sites corporativos, landing pages, startups, advogados, serviços gerais. Caso não haja um template específico, simule o estilo de modelos Bootstrap populares (ex: Agency, Creative) via customCss.
    - "nuptial": (Caminho: templates/nuptial/) -> Use para casamentos, noivados, convites, eventos.
    - "medico": (Caminho: templates/medico/) -> Use para clínicas, médicos, dentistas, saúde, estética.
    - "ecommerce": (Caminho: templates/ecommerce/) -> Use para lojas virtuais, vendas de produtos, vitrines.
    - "erp": (Caminho: templates/erp/) -> Use para sistemas, dashboards, painéis administrativos, CRM.
    - "restaurante": (Caminho: templates/restaurante/) -> Use para restaurantes, bares, cafeterias, delivery.
    
    Se nenhuma categoria específica se aplicar, use "generic".
    
    CORES E IDENTIDADE VISUAL (CONGRUÊNCIA):
    - As cores devem ser profissionais e congruentes com o nicho e com a interface do sistema.
    - Se for um SISTEMA ("system"), use cores que facilitem a leitura prolongada (fundo claro, contraste alto, azul/cinza corporativo).
    - Se for LANDING PAGE ("landing"), use cores vibrantes para conversão, mas mantenha harmonia com a identidade visual sugerida.
    - Garanta que 'primary', 'secondary' e 'accent' conversem entre si.
    
    ESTRUTURA JSON PARA "landing":
    {
        "projectType": "landing",
        "templateSource": "generic | nuptial | medico | ecommerce | restaurante",
        "brandName": "Nome da Empresa",
        "niche": "Nicho de mercado",
        "themeStyle": "modern | creative | corporate | minimalist | tech | elegant",
        "layout": { 
            "heroStyle": "center | split-left | split-right", 
            "cardStyle": "shadow | border | flat", 
            "borderRadius": "rounded | rounded-pill | sharp" 
        },
        "colors": {
            "primary": "#HEX", "secondary": "#HEX", "accent": "#HEX", 
            "background": "#HEX (Fundo da página)", "text": "#HEX (Cor do texto - ALTO CONTRASTE)", "card_bg": "#HEX (Fundo dos cards)"
        },
        "sectionTitles": {
            "services": "Título da Seção (ex: 'Cerimônia', 'Nossos Serviços')", 
            "services_subtitle": "Subtítulo (ex: 'Detalhes do evento')",
            "portfolio": "Título (ex: 'Galeria de Fotos', 'Portfólio')", 
            "portfolio_subtitle": "Subtítulo",
            "features": "Título (ex: 'Lista de Presentes', 'Diferenciais')",
            "testimonials": "Título (ex: 'Mensagens dos Padrinhos', 'Depoimentos')",
            "contact": "Título (ex: 'RSVP', 'Contato')", "contact_subtitle": "Subtítulo"
        },
        "fonts": {
            "heading": "FontName (Google Fonts)", "body": "FontName (Google Fonts)"
        },
        "hero": { "title": "Headline", "subtitle": "Subhead", "cta": "Button Text" },
        "about": { "title": "Sobre", "text": "Texto", "stats": [{"number": "10", "label": "Anos"}] },
        "services": [{"title": "Serviço", "desc": "Desc", "icon": "bi-star"}],
        "features": [{"title": "Feature", "desc": "Desc", "icon": "bi-check-circle"}],
        "portfolio": [{"title": "Proj", "category": "Cat", "desc": "Desc"}],
        "testimonials": [{"name": "Cliente", "role": "Cargo", "text": "Depoimento"}],
        "contact": { "address": "Endereço", "email": "Email", "phone": "Tel", "cta_text": "CTA" },
        "customCss": "CSS COMPLETO. IMPORTANTE: Se usar imagem de fundo no Hero, adicione 'text-shadow: 0 2px 10px rgba(0,0,0,0.8)' nos títulos para garantir leitura. Estilize botões com gradientes.",
        "images": {
            "hero": "description", "about": "description", "feature": "description", "portfolio": "description"
        }
    }

    ESTRUTURA JSON PARA "system":
    {
        "projectType": "system",
        "templateSource": "erp | generic",
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
    5. IMAGENS: Retorne descrições visuais do CONTEÚDO em INGLÊS (ex: "modern office workspace", "plate of pasta"). NÃO envie URLs.
    6. CORES E CONTRASTE (CRÍTICO - LEIA COM ATENÇÃO): 
       - A LEGIBILIDADE É A PRIORIDADE NÚMERO 1.
       - Se 'background' for escuro (ex: #000, #1a1a1a, #0f172a), 'text' DEVE SER EXATAMENTE #FFFFFF.
       - Se 'background' for claro (ex: #fff, #f8f9fa), 'text' DEVE SER EXATAMENTE #212529.
       - NUNCA use cinza médio para texto principal.
    7. FONTS: Use nomes reais do Google Fonts (ex: 'Poppins', 'Montserrat', 'Open Sans', 'Playfair Display', 'Roboto').
    `;

    // Simulação de Progresso para UX
    const progressSteps = [
        "🔍 Analisando seu nicho de mercado...",
        "⚡ Conectando ao motor Mistral AI...",
        "🎨 Criando design system e paleta...",
        "🚀 Gerando código do site..."
    ];
    let stepIndex = 0;
    const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
            updateLastMessage(`${progressSteps[stepIndex]} <span class='typing-indicator'></span>`);
            stepIndex++;
        }
    }, 2500);

    let text = null;

    // TENTATIVA 1: Proxy Local (Ideal para Produção/Netlify)
    if (!text) {
        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: "mistral", // Força o uso da Mistral no backend
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userInput + "\n\n(Gere o JSON completo agora.)" }
                    ]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Suporte para resposta direta ou formato OpenAI
                text = data.choices?.[0]?.message?.content || data.body || data;
                if (typeof text !== 'string') text = JSON.stringify(text);
            } else {
                // Se der 404 ou 405, estamos em localhost sem Netlify Dev -> Força erro para cair no catch
                if (response.status === 404 || response.status === 405) {
                    throw new Error("Proxy indisponível (Localhost)");
                }
                console.error(`❌ Erro no Proxy (${response.status})`);
            }
        } catch (e) {
            console.warn("⚠️ Proxy falhou, tentando conexão direta com Mistral...", e);
            
            // TENTATIVA 2: Conexão Direta (Fallback para Localhost)
            try {
                const MISTRAL_KEY = "otFYtFdY9xu6WD0qQfKUpAIrHV4rSERK"; // Chave de Dev
                const directResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MISTRAL_KEY}`
                    },
                    body: JSON.stringify({
                        model: "mistral-small-latest",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userInput + "\n\n(Gere o JSON completo agora.)" }
                        ],
                        temperature: 0.7
                    })
                });

                if (directResponse.ok) {
                    const data = await directResponse.json();
                    text = data.choices?.[0]?.message?.content;
                } else {
                    console.error("❌ Erro na conexão direta:", await directResponse.text());
                }
            } catch (directError) {
                console.error("❌ Falha total na conexão:", directError);
            }
        }
    }

    clearInterval(progressInterval); // Para a animação

    // 3. TENTATIVA: Fallback de Emergência (Nunca entregar erro)
    if (!text) {
        console.error("❌ Todas as IAs falharam. Gerando template de emergência.");
        
        // Detecção básica de intenção para o fallback (Melhoria UX)
        let fallbackTemplate = "generic";
        let fallbackNiche = "Geral";
        let fallbackBrand = "Seu Negócio";
        const lowerInput = (userInput || "").toLowerCase();

        if (lowerInput.includes("casamento") || lowerInput.includes("noiva") || lowerInput.includes("wedding")) {
            fallbackTemplate = "nuptial";
            fallbackNiche = "Casamento";
            fallbackBrand = "Casamento dos Sonhos";
        } else if (lowerInput.includes("medico") || lowerInput.includes("clinica") || lowerInput.includes("saude") || lowerInput.includes("dentista")) {
            fallbackTemplate = "medico";
            fallbackNiche = "Saúde";
            fallbackBrand = "Clínica Saúde";
        } else if (lowerInput.includes("loja") || lowerInput.includes("ecommerce") || lowerInput.includes("venda")) {
            fallbackTemplate = "ecommerce";
            fallbackNiche = "E-commerce";
            fallbackBrand = "Minha Loja";
        }

        text = JSON.stringify({
            projectType: "landing",
            templateSource: fallbackTemplate,
            brandName: fallbackBrand,
            niche: fallbackNiche,
            themeStyle: "modern",
            colors: { primary: "#0d6efd", secondary: "#6c757d", accent: "#0dcaf0", background: "#ffffff", text: "#212529", card_bg: "#f8f9fa" },
            fonts: { heading: "Montserrat", body: "Open Sans" },
            hero: { title: "Bem-vindo ao seu Site", subtitle: "A IA está indisponível no momento, mas geramos este layout base para você editar.", cta: "Saiba Mais" },
            about: { title: "Sobre Nós", text: "Descreva sua empresa aqui. Este é um texto de preenchimento automático.", stats: [] },
            services: [{ title: "Serviço Principal", desc: "Descrição do serviço.", icon: "bi-star" }, { title: "Outro Serviço", desc: "Descrição do serviço.", icon: "bi-gear" }],
            features: [],
            portfolio: [],
            testimonials: [],
            contact: { address: "Seu Endereço", email: "contato@empresa.com", phone: "(00) 0000-0000", cta_text: "Fale Conosco" },
            images: {}
        });
    }

    try {
        console.log("🤖 Resposta Bruta da IA (ou Fallback):", text);

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
            // Correção automática para JSON mal formatado (vírgulas extras)
            text = text.replace(/,(\s*[}\]])/g, '$1');
            siteData = JSON.parse(text);

            // Fallback de cores para garantir contraste se a IA falhar
            if (!siteData.colors) {
                siteData.colors = {
                    "primary": "#0d6efd", "secondary": "#6c757d", "accent": "#0dcaf0", 
                    "background": "#ffffff", "text": "#212529", "card_bg": "#f8f9fa"
                };
            }

            // --- BANCO DE IMAGENS PREMIUM (TEMPLATES REAIS) ---
            // Garante fotos de alta qualidade para nichos comuns, evitando "robôs" ou falhas da IA
            const TEMPLATE_IMAGES = {
                "advocacia": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80",
                "direito": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1920&q=80",
                "medico": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1920&q=80",
                "saude": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1920&q=80",
                "clinica": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
                "tech": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80",
                "tecnologia": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80",
                "marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80",
                "fitness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80",
                "academia": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1920&q=80",
                "restaurante": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
                "comida": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
                "cafe": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1920&q=80",
                "ecommerce": "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1920&q=80",
                "loja": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80",
                "arquitetura": "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1920&q=80",
                "construcao": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80",
                "educacao": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
                "escola": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80",
                "casamento": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80",
                "wedding": "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&w=1920&q=80",
                "noiva": "https://images.unsplash.com/photo-1595838788845-30242ad81cf8?auto=format&fit=crop&w=1920&q=80",
                "festa": "https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=1920&q=80"
            };

            // --- FIX: Sistema Robusto de Imagens (Pollinations AI) ---
            const fixImage = (description, type = 'landscape') => {
                let prompt = description;
                const nicheKey = (siteData.niche || "").toLowerCase();
                
                // 1. Validação e Fallback
                if (!prompt || typeof prompt !== 'string' || prompt.length < 3) {
                    prompt = `${siteData.niche || "business"} ${siteData.themeStyle || "modern"}`;
                }
                
                // 2. Detecção Agressiva de URLs (Se a IA mandar link, ignoramos e usamos o nicho)
                // Regex ajustado para evitar falsos positivos, mas pegar links reais
                if (prompt.match(/(https?:\/\/|www\.|unsplash\.com|source\.unsplash|\.com|\.net|\.org)/i)) {
                    prompt = `${siteData.niche || "modern business"} ${siteData.themeStyle || "professional"}`;
                }
                
                // 3. Limpeza Inteligente
                // Remove caracteres de código mas mantém acentos e pontuação básica
                let cleanPrompt = prompt.replace(/[<>{}[\]\\\/]/g, '').trim();
                
                // 4. VERIFICAÇÃO DE TEMPLATE (Prioridade Máxima)
                // Se o nicho do usuário bater com nosso banco de imagens, usamos a foto real (Unsplash)
                // Isso evita o "robô" ou imagens estranhas da IA em nichos comuns.
                for (const [key, url] of Object.entries(TEMPLATE_IMAGES)) {
                    if (nicheKey.includes(key) || cleanPrompt.toLowerCase().includes(key)) {
                        // Retorna a imagem de template se for compatível
                        // Adiciona um parametro aleatório para evitar cache se usar a mesma imagem várias vezes
                        return url + "&random=" + Math.floor(Math.random() * 1000);
                    }
                }

                // 5. Engenharia de Prompt para Qualidade (Injeta realismo se não tiver template)
                // Adiciona modificadores para garantir qualidade fotográfica
                const enhancedPrompt = `${cleanPrompt}, realistic, 8k, cinematic lighting, high quality, professional photo`;
                const encodedPrompt = encodeURIComponent(enhancedPrompt);
                
                const width = type === 'portrait' ? 600 : 1280;
                const height = type === 'portrait' ? 800 : 720;
                const seed = Math.floor(Math.random() * 10000);
                
                // Usa o modelo 'flux' para maior realismo e 'nologo' para limpar a imagem
                return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux&seed=${seed}`;
            };

            // Garantir que todas as imagens essenciais existam
            if (!siteData.images) siteData.images = {};
            
            // 1. Processar TODAS as imagens que vieram no JSON (não apenas as required)
            Object.keys(siteData.images).forEach(key => {
                siteData.images[key] = fixImage(siteData.images[key]);
            });

            // 2. Garantir que as obrigatórias existam
            const requiredImages = ['hero', 'about', 'feature', 'portfolio'];
            requiredImages.forEach(key => {
                if (!siteData.images[key]) {
                    siteData.images[key] = fixImage((siteData.niche || "business") + " " + key);
                }
            });

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
            
            // Lista de templates disponíveis (baseado nas pastas em templates/)
            const templatesHtml = `
                <div class="mt-3 pt-3 border-top" style="border-color: rgba(255,255,255,0.1) !important;">
                    <small class="text-white-50 d-block mb-2" style="font-size: 0.85em;">Não gostou do layout? Tente outro modelo:</small>
                    <div class="d-flex flex-wrap gap-2 justify-content-center">
                        <button class="btn btn-outline-light btn-sm retry-template-btn" data-template="generic" style="font-size: 0.75rem;">🏢 Corporativo</button>
                        <button class="btn btn-outline-light btn-sm retry-template-btn" data-template="medico" style="font-size: 0.75rem;">🏥 Saúde</button>
                        <button class="btn btn-outline-light btn-sm retry-template-btn" data-template="restaurante" style="font-size: 0.75rem;">🍽️ Restaurante</button>
                        <button class="btn btn-outline-light btn-sm retry-template-btn" data-template="nuptial" style="font-size: 0.75rem;">💍 Casamento</button>
                        <button class="btn btn-outline-light btn-sm retry-template-btn" data-template="ecommerce" style="font-size: 0.75rem;">🛍️ Loja</button>
                        <button class="btn btn-outline-light btn-sm retry-template-btn" data-template="erp" style="font-size: 0.75rem;">📊 Sistema</button>
                    </div>
                </div>
            `;

            addMessage(`
                <strong>Site Gerado!</strong> 🚀<br>
                Criei um projeto exclusivo para <strong>${siteData.brandName}</strong>.<br>
                <ul>
                    <li>Paleta: <span style="color:${siteData.colors.primary}">■</span> ${siteData.colors.primary} e <span style="color:${siteData.colors.secondary}">■</span> ${siteData.colors.secondary}</li>
                    <li>Foco: ${siteData.niche}</li>
                </ul>
                <div class="alert alert-warning p-2 mt-2" style="font-size: 0.85em;">
                    <i class="bi bi-exclamation-triangle"></i> <strong>Nota:</strong> As imagens são geradas por IA em tempo real e podem apresentar variações ou não corresponder exatamente ao contexto.
                </div>
                <div class="text-center mt-3">
                    <a href="generated.html?v=${timestamp}" target="_blank" class="btn btn-success btn-sm">
                        <i class="bi bi-magic"></i> Ver Site Gerado
                    </a>
                </div>
                ${templatesHtml}
            `, 'bot');
        }

    } catch (e) {
        clearInterval(progressInterval);
        console.error("Erro detalhado:", e);
        let errorMsg = "Desculpe, não consegui gerar o site agora.";
        
        // Diagnóstico de erro para o usuário
        if (e.toString().includes('403') || e.toString().includes('API key')) {
            errorMsg = "Erro de Autenticação: Verifique se a API Key é válida e está habilitada no Google Cloud.";
        } else if (e.toString().includes('429')) {
            errorMsg = "Muitas requisições. Aguarde alguns instantes e tente novamente.";
        } else if (e.toString().includes('404')) {
            errorMsg = "Erro 404: Não consegui acessar a Função do Netlify. Se estiver rodando localmente, use 'netlify dev' ou insira a chave no chat.";
        } else if (e.toString().includes('502')) {
            errorMsg = "Erro 502 (Bad Gateway): A função do servidor falhou ou excedeu o tempo limite (10s). Tente novamente.";
        } else if (e.toString().includes('504')) {
            errorMsg = "Erro 504 (Timeout): A IA demorou mais de 10s e o servidor encerrou. Dica: Cole sua chave 'pplx-' no chat para conectar direto (sem limite de tempo).";
        } else if (e.toString().includes('405')) {
            errorMsg = "Erro 405: Você está rodando no Live Server (local). As funções de servidor não funcionam aqui. Para testar, cole sua chave 'pplx-' diretamente no chat.";
        }

        addMessage(`${errorMsg} Tente novamente com mais detalhes.`, 'bot');
        input.disabled = false;
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener('click', handleUserResponse);
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleUserResponse() });

// Botão Limpar
if(clearBtn) {
    clearBtn.addEventListener('click', () => {
        chatWindow.innerHTML = `
            <div class="ai-message bot">
                Olá! Sou a IA da Inove. Posso criar um site completo para você agora mesmo.<br>
                <strong>Qual é o nome do seu negócio e o que você faz?</strong>
            </div>
        `;
        input.disabled = false;
        sendBtn.disabled = false;
        input.value = '';
        step = 0;
    });
}

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

// Listener Global para os botões de "Tentar com novo template" (Event Delegation)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('retry-template-btn')) {
        const selectedTemplate = e.target.getAttribute('data-template');
        const templateName = e.target.innerText;
        
        // Desabilita os botões para evitar múltiplos cliques
        document.querySelectorAll('.retry-template-btn').forEach(btn => btn.disabled = true);
        
        // Adiciona mensagem do usuário simulada
        addMessage(`Quero testar com o modelo <strong>${templateName}</strong>`, 'user');
        addMessage(`Perfeito! Recriando o design usando o modelo ${templateName}... <span class='typing-indicator'></span>`, 'bot');

        // Reconstrói o prompt forçando o template, mas mantendo os dados originais
        // userData.details contém o pedido original do usuário
        const forcedPrompt = `${userData.details}\n\n[SYSTEM INSTRUCTION: O usuário solicitou explicitamente REFAZER o JSON usando o templateSource: "${selectedTemplate}". Mantenha os mesmos dados de negócio, mas adapte estritamente para este template.]`;
        
        generateSiteStructure(forcedPrompt);
    }
});
