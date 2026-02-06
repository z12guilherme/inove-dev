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
            // Chama a função de geração (agora usando Netlify Functions/Gemini)
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
    Atue como um Designer de Interface Premiado (nível Awwwards/Dribbble) e Especialista em UX.
    Sua missão é criar o JSON estruturado para um site EXTREMAMENTE BONITO, visualmente impactante e de alta conversão.
    
    OBJETIVO VISUAL:
    O design NÃO PODE SER GENÉRICO. Deve parecer um template Premium de $500.
    
    DIRETRIZES DE ESTÉTICA (CRÍTICO):
    1. REGRA 60-30-10: Use a cor 'background' (60%), 'primary' (30%) e 'accent' (10%) com harmonia absoluta.
    2. WHITESPACE: O design deve "respirar". Use margens generosas.
    3. TIPOGRAFIA: Escolha pares de fontes sofisticados (ex: 'Playfair Display' + 'Lato', 'Montserrat' + 'Open Sans', 'Oswald' + 'Roboto').
    4. CUSTOM CSS: O campo 'customCss' é OBRIGATÓRIO para a beleza. Você deve injetar CSS para:
       - Sombras suaves e difusas (ex: box-shadow: 0 15px 30px rgba(0,0,0,0.08)).
       - Botões com gradientes sutis e efeito hover (transform: translateY(-2px)).
       - Bordas arredondadas modernas (border-radius: 12px ou 20px).
    
    PRIMEIRO, DECIDA O TIPO DE PROJETO COM BASE NO PEDIDO:
    1. "landing": Se for site institucional, landing page, portfólio, loja virtual (vitrine).
    2. "system": Se for sistema de gestão, ERP, CRM, dashboard, painel administrativo, controle de estoque, financeiro.
    
    SELEÇÃO DE TEMPLATE (templateSource):
    ATENÇÃO: O sistema possui VÁRIOS templates na pasta 'templates/'. NÃO use apenas o 'generic'.
    Você DEVE analisar o pedido do usuário e selecionar a pasta correta abaixo para garantir um design diferenciado.
    
    MAPA DE TEMPLATES (templateSource -> Pasta):
    - "nuptial"     -> templates/nuptial/     (Obrigatório para: Casamentos, Festas, Eventos)
    - "strategy"    -> templates/strategy/    (Obrigatório para: Corporativo, Empresas, Negócios, Startups, Consultoria, Marketing, Advocacia, Tech, Engenharia)
    - "medico"      -> templates/medico/      (Obrigatório para: Saúde, Clínicas, Dentistas, Psicólogos)
    - "pizza"       -> templates/pizza/       (Obrigatório para: Pizzarias, Restaurantes, Bares, Cafés, Delivery)
    - "ecommerce"   -> templates/ecommerce/   (Obrigatório para: Lojas, Vendas, Comércio, Varejo)
    - "erp"         -> templates/erp/         (Obrigatório para: Sistemas, Dashboards, Admin, CRM)
    - "iportfolio"  -> templates/iportfolio/  (Obrigatório para: Portfólio, Currículos, Freelancers, Pessoal)
    
    REGRA: Se o usuário pedir um site de casamento, é PROIBIDO usar "generic". Use "nuptial".
    Se o usuário pedir uma loja, é PROIBIDO usar "generic". Use "ecommerce".
    Se o usuário pedir um portfólio, é PROIBIDO usar "generic". Use "iportfolio".
    Se o usuário pedir um site de empresa, corporativo, advocacia ou tech, é PROIBIDO usar "generic". Use "strategy".
    Se o usuário pedir comida, restaurante ou pizza, use "pizza".
    
    CORES E IDENTIDADE VISUAL (CONGRUÊNCIA):
    - As cores devem ser profissionais e congruentes com o nicho e com a interface do sistema.
    - Se for um SISTEMA ("system"), use cores que facilitem a leitura prolongada (fundo claro, contraste alto, azul/cinza corporativo).
    - Se for LANDING PAGE ("landing"), use cores vibrantes para conversão, mas mantenha harmonia com a identidade visual sugerida.
    - Garanta que 'primary', 'secondary' e 'accent' conversem entre si.
    
    ESTRUTURA JSON PARA "landing":
    {
        "projectType": "landing",
        "templateSource": "strategy | nuptial | medico | pizza | iportfolio",
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
        "ui": {
            "nav_home": "Início", "nav_about": "Sobre", "nav_services": "Serviços", "nav_portfolio": "Portfólio", "nav_contact": "Contato",
            "btn_read_more": "Saiba Mais", "btn_submit": "Enviar Mensagem"
        },
        "customCss": "CSS OBRIGATÓRIO AQUI. Ex: .btn-get-started { background: linear-gradient(45deg, var(--primary), var(--accent)); border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); } .icon-box { transition: all 0.3s; border-radius: 15px; } .icon-box:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); } h1, h2 { letter-spacing: -0.5px; }",
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
    5. IMAGENS: Não gere descrições de imagens. Deixe os valores do objeto "images" como strings vazias "". O sistema usará o banco de imagens padrão.
    6. CORES E CONTRASTE (SEGURANÇA VISUAL): 
       - A LEGIBILIDADE É A PRIORIDADE NÚMERO 1.
       - Se 'background' for escuro (ex: #000, #1a1a1a, #0f172a), 'text' DEVE SER EXATAMENTE #FFFFFF.
       - Se 'background' for claro (ex: #fff, #f8f9fa), 'text' DEVE SER EXATAMENTE #212529.
       - NUNCA use cinza médio para texto principal.
    7. FONTS: Use nomes reais do Google Fonts (ex: 'Poppins', 'Montserrat', 'Open Sans', 'Playfair Display', 'Roboto').
    8. IDIOMA: O conteúdo deve ser 100% em Português do Brasil. O objeto 'ui' deve conter as traduções dos termos de navegação e botões adequados ao nicho (ex: 'Cardápio' em vez de 'Serviços' para restaurantes).
    `;

    // Simulação de Progresso para UX
    const progressSteps = [
        "🔍 Analisando seu nicho de mercado...",
        "⚡ Conectando ao motor Google Gemini...",
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
                    provider: "gemini", // Agora usamos Gemini como padrão
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userInput + "\n\n(Gere o JSON completo agora.)" }
                    ]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Suporte para resposta direta ou formato OpenAI
                if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                    text = data.choices[0].message.content;
                } else if (typeof data === 'string') {
                    text = data;
                }
                // Se não encontrar texto válido, 'text' continua null e aciona o fallback abaixo
            } else {
                // Tenta ler a mensagem de erro do servidor
                const errorData = await response.json().catch(() => ({}));
                // Se der erro (401, 404, 500), lança exceção para ativar o fallback (Tentativa 2)
                throw new Error(`Erro no Proxy (${response.status}): ${errorData.error?.message || response.statusText}`);
            }
        } catch (e) {
            console.warn("⚠️ Proxy falhou, tentando conexão direta com Gemini...", e);
            
            // TENTATIVA 2: Conexão Direta (Fallback para Localhost)
            try {
                // Chave de emergência para funcionamento local
                const GEMINI_DIRECT_KEY = ""; // REMOVIDO: Use variáveis de ambiente no Netlify
                
                if (!GEMINI_DIRECT_KEY) throw new Error("Chave de API direta não configurada. Verifique o backend.");

                const directResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_DIRECT_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ 
                            role: "user", 
                            parts: [{ text: userInput + "\n\n(Gere o JSON completo agora.)" }] 
                        }],
                        systemInstruction: {
                            parts: [{ text: systemPrompt }]
                        },
                        generationConfig: {
                            responseMimeType: "application/json"
                        }
                    })
                });

                if (directResponse.ok) {
                    const data = await directResponse.json();
                    text = data.candidates?.[0]?.content?.parts?.[0]?.text;
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
        let fallbackTemplate = "strategy";
        let fallbackNiche = "Corporativo";
        let fallbackBrand = "Nova Era Soluções";
        let fallbackColors = { primary: "#0d6efd", secondary: "#6c757d", accent: "#0dcaf0", background: "#ffffff", text: "#212529", card_bg: "#f8f9fa" };
        
        const lowerInput = (userInput || "").toLowerCase();

        // 1. Tenta extrair o nome da empresa do prompt (Entre aspas ou após "chamada")
        const nameRegex = /(?:chamada|chama|nome|marca|empresa)\s*(?:de|é|e|se)?\s*[:]?\s*['"]([^'"]+)['"]/i;
        const nameMatch = userInput.match(nameRegex);
        if (nameMatch && nameMatch[1]) {
            fallbackBrand = nameMatch[1];
        }

        // 2. Detecção de Cores Básica (Fallback Inteligente)
        if (lowerInput.includes("marrom") || lowerInput.includes("café") || lowerInput.includes("rústico") || lowerInput.includes("creme")) {
            fallbackColors = { primary: "#6F4E37", secondary: "#A1887F", accent: "#D7CCC8", background: "#EFEBE9", text: "#3E2723", card_bg: "#FFFFFF" };
        } else if (lowerInput.includes("azul")) {
            fallbackColors = { primary: "#0d6efd", secondary: "#6c757d", accent: "#0dcaf0", background: "#ffffff", text: "#212529", card_bg: "#f8f9fa" };
        } else if (lowerInput.includes("verde") || lowerInput.includes("saúde") || lowerInput.includes("natureza")) {
            fallbackColors = { primary: "#198754", secondary: "#146c43", accent: "#d1e7dd", background: "#ffffff", text: "#0f5132", card_bg: "#f8f9fa" };
        } else if (lowerInput.includes("preto") || lowerInput.includes("dark") || lowerInput.includes("escuro")) {
            fallbackColors = { primary: "#ffffff", secondary: "#adb5bd", accent: "#6c757d", background: "#212529", text: "#f8f9fa", card_bg: "#343a40" };
        } else if (lowerInput.includes("rosa") || lowerInput.includes("feminino")) {
            fallbackColors = { primary: "#d63384", secondary: "#ad1457", accent: "#f8d7da", background: "#fff0f3", text: "#880e4f", card_bg: "#ffffff" };
        }

        // 3. Seleção de Template e Nicho
        if (lowerInput.includes("casamento") || lowerInput.includes("noiva") || lowerInput.includes("wedding")) {
            fallbackTemplate = "nuptial";
            fallbackNiche = "Casamento";
            if (!nameMatch) fallbackBrand = "Ana & Pedro";
        } else if (lowerInput.includes("medico") || lowerInput.includes("clinica") || lowerInput.includes("saude") || lowerInput.includes("dentista")) {
            fallbackTemplate = "medinest";
            fallbackNiche = "Saúde";
            if (!nameMatch) fallbackBrand = "Vitalis Clínica";
        } else if (lowerInput.includes("curso") || lowerInput.includes("escola") || lowerInput.includes("educacao") || lowerInput.includes("aula")) {
            fallbackTemplate = "learne";
            fallbackNiche = "Educação";
            if (!nameMatch) fallbackBrand = "Educa Mais";
        } else if (lowerInput.includes("blog") || lowerInput.includes("noticia") || lowerInput.includes("artigo")) {
            fallbackTemplate = "story";
            fallbackNiche = "Blog";
            if (!nameMatch) fallbackBrand = "Daily News";
        } else if (lowerInput.includes("foto") || lowerInput.includes("fotografia") || lowerInput.includes("galeria")) {
            fallbackTemplate = "snapfolio";
            fallbackNiche = "Fotografia";
            if (!nameMatch) fallbackBrand = "Click Studio";
        } else if (lowerInput.includes("agencia") || lowerInput.includes("criativo") || lowerInput.includes("design")) {
            fallbackTemplate = "craftivo";
            fallbackNiche = "Agência";
            if (!nameMatch) fallbackBrand = "Creative Minds";
        } else if (lowerInput.includes("app") || lowerInput.includes("produto") || lowerInput.includes("landing")) {
            fallbackTemplate = "leadpage";
            fallbackNiche = "Produto";
            if (!nameMatch) fallbackBrand = "App Launch";
        } else if (lowerInput.includes("loja") || lowerInput.includes("ecommerce") || lowerInput.includes("venda")) {
            fallbackTemplate = "leadpage"; // Fallback para venda
            fallbackNiche = "E-commerce";
            if (!nameMatch) fallbackBrand = "Urban Store";
        } else if (lowerInput.includes("cafe") || lowerInput.includes("cafeteria")) {
            fallbackTemplate = "pizza"; // Usa estrutura de restaurante
            fallbackNiche = "Cafeteria";
            if (!nameMatch) fallbackBrand = "Aroma & Sabor";
        } else if (lowerInput.includes("pizza") || lowerInput.includes("pizzaria")) {
            fallbackTemplate = "pizza";
            fallbackNiche = "Pizzaria";
            if (!nameMatch) fallbackBrand = "La Bella Pizza";
        } else if (lowerInput.includes("restaurante") || lowerInput.includes("comida") || lowerInput.includes("bar")) {
            fallbackTemplate = "pizza";
            fallbackNiche = "Gastronomia";
            if (!nameMatch) fallbackBrand = "Bistrô Chef";
        } else if (lowerInput.includes("portfolio") || lowerInput.includes("curriculo") || lowerInput.includes("pessoal")) {
            fallbackTemplate = "iportfolio";
            fallbackNiche = "Portfólio";
            if (!nameMatch) fallbackBrand = "João Silva Design";
        } else if (lowerInput.includes("empresa") || lowerInput.includes("negocio") || lowerInput.includes("consultoria") || lowerInput.includes("corporativo")) {
            fallbackTemplate = "strategy";
            fallbackNiche = "Corporativo";
            if (!nameMatch) fallbackBrand = "Nexus Consultoria";
        }

        text = JSON.stringify({
            projectType: "landing",
            templateSource: fallbackTemplate,
            brandName: fallbackBrand,
            niche: fallbackNiche,
            themeStyle: "modern",
            colors: fallbackColors,
            fonts: { heading: "Montserrat", body: "Open Sans" },
            hero: { 
                title: "Transformando Ideias em Realidade", 
                subtitle: "Soluções inovadoras e estratégias personalizadas para levar o seu projeto ao próximo nível de excelência.", 
                cta: "Conheça Nossos Serviços" 
            },
            about: { 
                title: "Nossa História", 
                text: "Somos uma equipe apaixonada por entregar resultados. Com anos de experiência no mercado, combinamos criatividade e tecnologia para oferecer o melhor para nossos clientes. Nossa missão é superar expectativas e construir parcerias duradouras.", 
                stats: [{number: "10+", label: "Anos de Experiência"}, {number: "500+", label: "Projetos Entregues"}] 
            },
            services: [
                { title: "Consultoria Especializada", desc: "Análise detalhada e planejamento estratégico para o seu crescimento.", icon: "bi-graph-up-arrow" }, 
                { title: "Desenvolvimento Sob Medida", desc: "Soluções tecnológicas adaptadas exatamente às suas necessidades.", icon: "bi-laptop" },
                { title: "Suporte Premium", desc: "Atendimento ágil e eficiente para garantir sua tranquilidade.", icon: "bi-headset" }
            ],
            features: [
                { title: "Qualidade Garantida", desc: "Processos rigorosos para assegurar a excelência.", icon: "bi-check-circle-fill" },
                { title: "Inovação Constante", desc: "Estamos sempre à frente das tendências do mercado.", icon: "bi-lightbulb-fill" }
            ],
            portfolio: [
                { title: "Projeto Alpha", category: "Estratégia", desc: "Reestruturação completa de processos corporativos." },
                { title: "Campanha Beta", category: "Marketing", desc: "Lançamento de produto com alcance nacional." },
                { title: "Sistema Gama", category: "Tecnologia", desc: "Plataforma integrada de gestão." }
            ],
            testimonials: [
                { name: "Carlos Mendes", role: "CEO da TechCorp", text: "A equipe demonstrou um profissionalismo incrível. O resultado final superou todas as nossas expectativas." },
                { name: "Mariana Costa", role: "Diretora de Marketing", text: "Excelente atendimento e entrega no prazo. Recomendo fortemente para quem busca qualidade." }
            ],
            contact: { 
                address: "Av. Empresarial, 1000 - Torre Sul, São Paulo - SP", 
                email: "contato@" + fallbackBrand.toLowerCase().replace(/[^a-z0-9]/g, '') + ".com.br", 
                phone: "(11) 99999-0000", 
                cta_text: "Solicite um Orçamento" 
            },
            ui: {
                nav_home: "Início", nav_about: "Sobre", nav_services: "Serviços", nav_portfolio: "Portfólio", nav_contact: "Contato",
                btn_read_more: "Saiba Mais", btn_submit: "Enviar Mensagem"
            },
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
                "pizza": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80",
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

                // 5. GERAÇÃO REAL VIA POLLINATIONS AI (Se não tiver template)
                // Gera uma imagem única baseada no prompt
                const encodedPrompt = encodeURIComponent(cleanPrompt + " high quality, realistic, 4k, professional photography");
                return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
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
            // Salva com ID único para permitir múltiplos projetos e edição direta no template
            const storageKey = `ai_site_${timestamp}`;
            localStorage.setItem(storageKey, JSON.stringify(siteData));
            
            // Define o caminho real do template
            const templatePath = `templates/${siteData.templateSource || 'strategy'}/index.html`;
            const viewUrl = `${templatePath}?id=${timestamp}`;
            
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
                    <a href="${viewUrl}" target="_blank" class="btn btn-success btn-sm">
                        <i class="bi bi-magic"></i> Ver Site Gerado
                    </a>
                </div>
            `, 'bot');
        }

    } catch (e) {
        clearInterval(progressInterval);
        console.error("Erro detalhado:", e);
        let errorMsg = "Desculpe, não consegui gerar o site agora.";
        
        // Diagnóstico de erro para o usuário
        if (e.toString().includes('403') || e.toString().includes('API key')) {
            errorMsg = "Erro de Autenticação: Verifique se a API Key está configurada corretamente no Netlify.";
        } else if (e.toString().includes('429')) {
            errorMsg = "Muitas requisições (Cota excedida). Aguarde alguns instantes.";
        } else if (e.toString().includes('404')) {
            errorMsg = "Erro 404: Backend não encontrado. Se estiver local, use 'netlify dev'.";
        } else if (e.toString().includes('502')) {
            errorMsg = "Erro 502: O servidor demorou para responder. Tente novamente.";
        } else if (e.toString().includes('504')) {
            errorMsg = "Erro 504: Timeout. A IA demorou muito. Tente um pedido mais simples.";
        } else if (e.toString().includes('405')) {
            errorMsg = "Erro 405: Ambiente local sem backend. Use 'netlify dev' para testar com a IA.";
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
