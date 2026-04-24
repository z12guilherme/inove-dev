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

        // Sincronizar com Tawk.to para o agente saber quem é o visitante
        if (window.Tawk_API) {
            window.Tawk_API.setAttributes({
                'name': text.split(' ')[0], // Tenta pegar o primeiro nome
                'full_name': text,
                'ai_interaction': 'Iniciou conversa com Gemini'
            });
        }

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
    Atue como um Arquiteto de Software de Elite, Especialista em UI/UX Sênior e Copywriter de Alta Conversão.
    Sua missão é TRANSFORMAR um template base em uma experiência web "High-End", imersiva e altamente persuasiva.
    
    VOCÊ TEM PODER ABSOLUTO PARA REDESENHAR A INTERFACE USANDO A PROPRIEDADE 'customCss'.
    
    1. ARQUITETURA DO LAYOUT (templateSource):
    Escolha cirurgicamente a estrutura base de acordo com a jornada do usuário:
    - "pizza": Para produtos físicos, vitrines, catálogos, cardápios ou serviços baseados em grid.
    - "medico": Para prestadores de serviço, clínicas, agendamentos, times de especialistas.
    - "nuptial": Para eventos, lançamentos, linhas do tempo e narrativas visuais longas.
    - "iportfolio": Para branding pessoal, freelancers, infoprodutores e consultores.
    - "strategy": Para negócios B2B, SaaS, startups corporativas (Foco em Autoridade).
    - "ecommerce": APENAS para lojas complexas com múltiplos SKUs e carrinho.
    
    2. REDESIGN RADICAL E ANIMAÇÕES (customCss - CRÍTICO E OBRIGATÓRIO):
    Você NÃO deve apenas mudar cores. Você DEVE injetar CSS avançado para criar uma experiência Premium.
    - USE VARIÁVEIS CSS E ANIMAÇÕES. 
    - Aplique Glassmorphism (backdrop-filter: blur(15px)) em cards e headers.
    - Adicione micro-interações (hover effects com transform: translateY(-5px) e box-shadow).
    - Exemplo de injeção:
      ":root { --border-radius: 16px; } .hero { background: radial-gradient(circle at top right, var(--primary), #000); } .card { border-radius: var(--border-radius); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; } .card:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }"
    
    3. COPYWRITING PERSUASIVO (Gatilhos Mentais):
    - NÃO use "Bem-vindo ao nosso site". 
    - USE Headlines (títulos) focados na DOR do cliente ou na TRANSFORMAÇÃO (Ex: "Escale suas vendas em 30 dias sem aumentar o orçamento").
    - Subtítulos devem explicar o "Como" e criar autoridade.
    - CTAs (Botões) devem ser acionáveis (Ex: "Agendar Minha Consultoria", em vez de "Contato").
    
    4. IMAGENS PREMIUM:
    - O campo 'imageKeywords' será usado na API do Unsplash. Ele DEVE SER EM INGLÊS.
    - Adicione termos como "cinematic lighting", "high end", "professional", "minimalist" (ex: "luxury real estate modern interior cinematic lighting").
    
    ESTRUTURA DE RESPOSTA (JSON ESTRITO):
    {
        "projectType": "landing" | "system",
        "templateSource": "strategy" | "pizza" | "medico" | "nuptial" | "ecommerce" | "iportfolio",
        "brandName": "Nome Estratégico da Marca",
        "niche": "Nicho Analisado Profundamente",
        "themeStyle": "modern | minimalist | bold | luxury | cyber | organic",
        "colors": {
            "primary": "#HEX (Cor de destaque e botões principais)",
            "secondary": "#HEX (Cor de apoio e gradientes)",
            "accent": "#HEX (Para detalhes e alertas)",
            "background": "#HEX (Fundo geral - prefira tons escuros muito profundos ou claros muito limpos)",
            "text": "#HEX (Alto contraste com background)",
            "card_bg": "#HEX (Cor dos cards, ex: rgba(255,255,255,0.05) para dark mode)"
        },
        "fonts": { 
            "heading": "Nome da Fonte Google (ex: 'Outfit' ou 'Playfair Display')", 
            "body": "Nome da Fonte Google (ex: 'Inter' ou 'Roboto')" 
        },
        "hero": { "title": "Headline Matadora (Máx 7 palavras)", "subtitle": "Subtítulo Persuasivo (Máx 20 palavras)", "cta": "Call to Action de Alto Valor" },
        "about": { "title": "Quem Somos (Focado em Autoridade)", "text": "Copywriting contando a história e provando valor...", "stats": [{"number": "X+", "label": "Métrica de Prova Social"}] },
        "services": [
            {"title": "Nome do Serviço/Produto", "desc": "Benefício principal para o cliente", "icon": "bi-star (use ícones relevantes do bootstrap)"}
        ],
        "portfolio": [
            {"title": "Case de Sucesso", "category": "Resultado Obtido", "desc": "Breve explicação do problema resolvido"}
        ],
        "contact": { "address": "Endereço Premium", "email": "contato@marca.com", "phone": "+55 11 99999-9999", "cta_text": "Falar com Especialista" },
        "ui": {
            "nav_home": "Início", "nav_about": "A Empresa", "nav_services": "Soluções", "nav_portfolio": "Cases", "nav_contact": "Agendar",
            "btn_read_more": "Descobrir Mais", "btn_submit": "Solicitar Proposta"
        },
        "imageKeywords": "keywords in english for image search (ex: modern tech office futuristic aesthetic)",
        "customCss": "CÓDIGO CSS SUPER AVANÇADO E VÁLIDO PARA INJETAR NA PÁGINA (Sem crases ou blocos markdown. APENAS a string pura do CSS. Faça animações, use variáveis e mude radicalmente o template)"
    }
    
    REGRAS DE OURO:
    1. O resultado FINAL é um JSON CRU (Sem \`\`\`json ou qualquer formatação externa).
    2. TEXTOS EM PORTUGUÊS DO BRASIL.
    3. SURPREENDA O USUÁRIO COM UM DESIGN E COPYWRITING DE NÍVEL INTERNACIONAL.
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
                // Chave de emergência mantida vazia por segurança (usaremos o Proxy)
                const GEMINI_DIRECT_KEY = "";

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
                stats: [{ number: "10+", label: "Anos de Experiência" }, { number: "500+", label: "Projetos Entregues" }]
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

        addMessage(`${errorMsg} <br><br> <button onclick="window.callHumanAgent('Erro na IA: ${userInput}')" class="btn btn-primary btn-sm mt-2">Falar com Suporte Humano</button>`, 'bot');
        input.disabled = false;
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener('click', handleUserResponse);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserResponse() });

// Botão Limpar
if (clearBtn) {
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
