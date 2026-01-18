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
        "🧠 Identificando padrões com Machine Learning...",
        "🌐 Buscando referências em StartBootstrap e BootstrapMade...",
        "🎨 Adaptando paleta de cores e tipografia...",
        "🚀 Gerando código exclusivo..."
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        updateLastMessage(`🧠 Construindo arquitetura do projeto... <span class='typing-indicator'></span>`);
        
        // --- IA LOCAL (JAVASCRIPT PURO) ---
        // Processa o texto localmente sem depender de API externa
        const siteData = LocalAI.process(userInput);

        clearInterval(progressInterval);
        const timestamp = new Date().getTime();

        localStorage.setItem('aiWebsiteData_v3', JSON.stringify(siteData));

        addMessage(`
            <strong>Site Gerado!</strong> 🚀<br>
            Projeto exclusivo para <strong>${siteData.brandName}</strong>.<br>
            <ul>
                <li>Paleta: <span style="color:${siteData.colors?.primary || '#0d6efd'}">■</span> ${siteData.colors?.primary || '#0d6efd'} e <span style="color:${siteData.colors?.secondary || '#6c757d'}">■</span> ${siteData.colors?.secondary || '#6c757d'}</li>
                <li>Foco: ${siteData.niche || 'genérico'}</li>
                <li>Motor: Inove Native AI v1.0</li>
            </ul>
            <div class="text-center mt-3">
                <a href="generated.html?v=${timestamp}" target="_blank" rel="nofollow" class="btn btn-success btn-sm">
                    <i class="bi bi-magic"></i> Ver Site Gerado
                </a>
            </div>
        `, 'bot');

    } catch (e) {
        clearInterval(progressInterval);
        console.error("Erro detalhado:", e);
        addMessage(`❌ ${e.message || "Erro ao gerar o site"} Tente novamente.`, 'bot');
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

// --- CÉREBRO DA IA LOCAL (SEM API) ---
const LocalAI = {
    // Dicionário de Cores para Extração (NLP Simples)
    colorMap: {
        'azul': '#0d6efd', 'blue': '#0d6efd', 'marinho': '#001f3f',
        'vermelho': '#dc3545', 'red': '#dc3545', 'vinho': '#800020',
        'verde': '#198754', 'green': '#198754', 'limao': '#32cd32',
        'preto': '#212529', 'black': '#000000', 'escuro': '#1a1a1a',
        'branco': '#ffffff', 'white': '#ffffff', 'claro': '#f8f9fa',
        'amarelo': '#ffc107', 'yellow': '#ffc107', 'ouro': '#ffd700',
        'roxo': '#6f42c1', 'purple': '#6f42c1', 'lilas': '#e6e6fa',
        'rosa': '#d63384', 'pink': '#d63384', 'magenta': '#ff00ff',
        'laranja': '#fd7e14', 'orange': '#fd7e14',
        'cinza': '#6c757d', 'gray': '#6c757d', 'prata': '#c0c0c0',
        'marrom': '#795548', 'brown': '#795548', 'bege': '#f5f5dc'
    },

    // Biblioteca de Templates (Baseada em StartBootstrap, BootstrapMade, TemplateMonster)
    templates: [
        { id: 'medilab', name: 'Medilab (BootstrapMade)', fontHead: 'Raleway', fontBody: 'Open Sans', hero: 'split-right', css: '.service-box { border-radius: 20px; border: 1px solid #eef0f2; box-shadow: none; } .service-box:hover { background: var(--primary); color: #fff; } .service-box:hover h4, .service-box:hover p { color: #fff !important; } .service-box:hover .service-icon { background: #fff; color: var(--primary); }' },
        { id: 'restaurantly', name: 'Restaurantly (BootstrapMade)', fontHead: 'Playfair Display', fontBody: 'Poppins', hero: 'center', css: 'body { background-color: #0c0b09; color: #fff; } .navbar { background: rgba(12, 11, 9, 0.9) !important; border-bottom: 1px solid #37332a; } .section-title h2::after { background: #cda45e; } .btn-custom { border: 2px solid #cda45e; color: #fff; border-radius: 50px; } .btn-custom:hover { background: #cda45e; }' },
        { id: 'arsha', name: 'Arsha Tech (BootstrapMade)', fontHead: 'Jost', fontBody: 'Open Sans', hero: 'split-left', css: '.hero-img { animation: up-down 2s ease-in-out infinite alternate-reverse both; } @keyframes up-down{0%{transform:translateY(10px)}100%{transform:translateY(-10px)}} .btn-custom { border-radius: 50px; }' },
        { id: 'agency', name: 'Agency (StartBootstrap)', fontHead: 'Montserrat', fontBody: 'Roboto Slab', hero: 'center', css: '.navbar { background: #212529 !important; } .btn-custom { border-radius: 4px; text-transform: uppercase; font-weight: 700; background-color: var(--primary); border: none; } .section-title h2 { text-transform: uppercase; }' },
        { id: 'wedding-love', name: 'Wedding Love (TemplateMonster)', fontHead: 'Great Vibes', fontBody: 'Lato', hero: 'center', css: '.navbar { background: rgba(255,255,255,0.95) !important; } .section-title h2 { font-family: "Great Vibes", cursive; font-size: 3.5rem; text-transform: none; color: var(--primary); } .section-title h2::after { display: none; } .btn-custom { border-radius: 0; letter-spacing: 2px; }' },
        { id: 'construction-pro', name: 'UpConstruction (BootstrapMade)', fontHead: 'Roboto Condensed', fontBody: 'Roboto', hero: 'split-right', css: '.service-box { background: #f5f6f7; } .card { border: none; } .btn-custom { border-radius: 2px; font-weight: bold; }' },
        { id: 'fitness-gp', name: 'Gp Fitness (BootstrapMade)', fontHead: 'Exo 2', fontBody: 'Open Sans', hero: 'center', css: '.navbar { background: #000 !important; } .section-title h2 { font-style: italic; text-transform: uppercase; } .service-box { border: 1px solid #333; background: #111; }' },
        { id: 'law-biz', name: 'BizPage Law (StartBootstrap)', fontHead: 'Cinzel', fontBody: 'Merriweather', hero: 'split-left', css: '.section-title h2::before { width: 60px; height: 3px; background: var(--primary); } .btn-custom { border-radius: 0; border: 1px solid #fff; }' },
        { id: 'real-estate', name: 'EstateAgency (BootstrapMade)', fontHead: 'Poppins', fontBody: 'Nunito', hero: 'split-right', css: '.navbar-brand { color: var(--primary) !important; } .service-box { border: 1px solid #eee; transition: 0.4s; } .service-box:hover { border-color: var(--primary); }' },
        { id: 'pet-lover', name: 'PetLover (Colorlib)', fontHead: 'Fredoka One', fontBody: 'Varela Round', hero: 'split-left', css: '.btn-custom { border-radius: 20px; border-width: 3px; } .service-icon { border-radius: 50%; background: var(--secondary); color: #fff; }' },
        { id: 'modern-clean', name: 'Modern Clean (Generic)', fontHead: 'Montserrat', fontBody: 'Open Sans', hero: 'center', css: '.btn-custom { border-radius: 50px; letter-spacing: 1px; } .card { border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }' }
    ],

    // Dicionário de Nichos e Palavras-chave
    niches: {
        saude: {
            keywords: ['medico', 'médico', 'doutor', 'clinica', 'clínica', 'saude', 'saúde', 'hospital', 'dentista', 'psicologo', 'terapia', 'nutricionista'],
            colors: { primary: '#00b4d8', secondary: '#caf0f8', accent: '#0077b6', background: '#f0f8ff', card_bg: '#ffffff', text: '#2b2d42' },
            hero: { title: "Cuidando do seu bem-estar com excelência", subtitle: "Profissionais dedicados à sua saúde e qualidade de vida.", cta: "Agendar Consulta" },
            features: ["Agendamento Online", "Telemedicina", "Especialistas Qualificados"],
            images: {
                hero: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['medilab', 'agency']
        },
        gastronomia: {
            keywords: ['restaurante', 'comida', 'lanche', 'pizza', 'hamburguer', 'sushi', 'cafe', 'café', 'bar', 'delivery', 'fome', 'gastronomia'],
            colors: { primary: '#d90429', secondary: '#edf2f4', accent: '#ef233c', background: '#1a1a1a', card_bg: '#2b2b2b', text: '#ffffff' },
            hero: { title: "Sabor inesquecível em cada prato", subtitle: "Ingredientes frescos e receitas tradicionais para você.", cta: "Ver Cardápio" },
            features: ["Cardápio Digital", "Delivery Rápido", "Reservas de Mesa"],
            images: {
                hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['restaurantly', 'agency']
        },
        tecnologia: {
            keywords: ['tech', 'tecnologia', 'software', 'app', 'sistema', 'dev', 'computador', 'informatica', 'startup', 'digital', 'web'],
            colors: { primary: '#4361ee', secondary: '#3f37c9', accent: '#4895ef', background: '#f8f9fa', card_bg: '#ffffff', text: '#212529' },
            hero: { title: "Inovação tecnológica para o futuro", subtitle: "Soluções digitais que transformam o seu negócio.", cta: "Fale com Especialista" },
            features: ["Suporte 24/7", "Alta Performance", "Segurança de Dados"],
            images: {
                hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1553877615-30c73094c6af?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['arsha', 'agency']
        },
        direito: {
            keywords: ['advogado', 'direito', 'lei', 'juridico', 'jurídico', 'escritorio', 'consultoria', 'legal'],
            colors: { primary: '#1d3557', secondary: '#457b9d', accent: '#a8dadc', background: '#f1faee', card_bg: '#ffffff', text: '#1d3557' },
            hero: { title: "Defendendo seus direitos com integridade", subtitle: "Assessoria jurídica especializada e comprometida.", cta: "Agendar Reunião" },
            features: ["Consultoria Especializada", "Atendimento Personalizado", "Sigilo Absoluto"],
            images: {
                hero: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['law-biz', 'agency']
        },
        beleza: {
            keywords: ['beleza', 'estetica', 'estética', 'salao', 'salão', 'cabelo', 'unha', 'maquiagem', 'spa', 'cosmetico'],
            colors: { primary: '#ffb5a7', secondary: '#fcd5ce', accent: '#f08080', background: '#fff0f3', card_bg: '#ffffff', text: '#5e503f' },
            hero: { title: "Realce sua beleza natural", subtitle: "Tratamentos exclusivos para você se sentir incrível.", cta: "Agendar Horário" },
            features: ["Profissionais Experientes", "Ambiente Relaxante", "Produtos Premium"],
            images: {
                hero: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['modern-clean', 'wedding-love']
        },
        construcao: {
            keywords: ['obra', 'construcao', 'construção', 'reforma', 'engenheiro', 'arquiteto', 'casa', 'predio', 'imovel'],
            colors: { primary: '#e76f51', secondary: '#2a9d8f', accent: '#f4a261', background: '#f4f4f9', card_bg: '#ffffff', text: '#264653' },
            hero: { title: "Construindo sonhos, entregando realidade", subtitle: "Projetos de engenharia e arquitetura de alto padrão.", cta: "Solicitar Orçamento" },
            features: ["Projetos Personalizados", "Gestão de Obras", "Materiais de Qualidade"],
            images: {
                hero: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1581094794329-cd1096a7a2e8?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['construction-pro', 'agency']
        },
        petshop: {
            keywords: ['pet', 'cachorro', 'gato', 'veterinario', 'veterinário', 'banho', 'tosa', 'animal', 'ração'],
            colors: { primary: '#fb8500', secondary: '#ffb703', accent: '#219ebc', background: '#fffcf2', card_bg: '#ffffff', text: '#023047' },
            hero: { title: "Amor e cuidado para o seu melhor amigo", subtitle: "Serviços completos de estética e saúde animal.", cta: "Agendar Banho" },
            features: ["Banho e Tosa", "Consultas Veterinárias", "Táxi Dog"],
            images: {
                hero: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['pet-lover', 'modern-clean']
        },
        academia: {
            keywords: ['academia', 'fitness', 'treino', 'musculação', 'crossfit', 'personal', 'saudavel', 'esporte'],
            colors: { primary: '#d00000', secondary: '#370617', accent: '#ffba08', background: '#03071e', card_bg: '#1a1a1a', text: '#ffffff' },
            hero: { title: "Supere seus limites todos os dias", subtitle: "Estrutura completa para você alcançar seus objetivos.", cta: "Começar Agora" },
            features: ["Equipamentos Modernos", "Aulas Coletivas", "Personal Trainer"],
            images: {
                hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['fitness-gp', 'arsha']
        },
        imobiliaria: {
            keywords: ['imobiliaria', 'imobiliária', 'imovel', 'imóvel', 'apartamento', 'casa', 'aluguel', 'venda', 'corretor'],
            colors: { primary: '#2a9d8f', secondary: '#264653', accent: '#e9c46a', background: '#f1faee', card_bg: '#ffffff', text: '#264653' },
            hero: { title: "Encontre o lar dos seus sonhos", subtitle: "As melhores oportunidades de imóveis na sua região.", cta: "Ver Imóveis" },
            features: ["Avaliação Gratuita", "Financiamento Facilitado", "Assessoria Jurídica"],
            images: {
                hero: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['real-estate', 'agency']
        },
        casamento: {
            keywords: ['casamento', 'noiva', 'noivo', 'matrimonio', 'cerimonia', 'festa', 'aliança', 'convite', 'bodas', 'casar', 'uniao', 'união'],
            colors: { primary: '#b5838d', secondary: '#ffcdb2', accent: '#6d6875', background: '#fff0f3', card_bg: '#ffffff', text: '#6d6875' },
            hero: { title: "Celebre o amor conosco", subtitle: "A contagem regressiva para o nosso grande dia começou.", cta: "Confirmar Presença" },
            features: ["Lista de Presentes", "Confirmação de Presença (RSVP)", "Nossa História"],
            images: {
                hero: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
                about: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?auto=format&fit=crop&w=800&q=80",
                feature: "https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&w=800&q=80"
            },
            recommendedTemplates: ['wedding-love', 'modern-clean']
        }
    },

    // Processamento Principal
    process: function(text) {
        const lowerText = text.toLowerCase();
        
        // 1. Identificar Nicho com Pontuação (Machine Learning Simplificado)
        let detectedNiche = 'generico';
        let maxScore = 0;

        for (const [key, data] of Object.entries(this.niches)) {
            let score = 0;
            data.keywords.forEach(k => {
                if (lowerText.includes(k)) score += 1; // Match simples
                // Match exato ganha mais pontos (evita falsos positivos parciais)
                const regex = new RegExp(`\\b${k}\\b`, 'i');
                if (regex.test(text)) score += 2;
            });
            
            if (score > maxScore) {
                maxScore = score;
                detectedNiche = key;
            }
        }
        
        let nicheData = this.niches[detectedNiche] || null;

        // Fallback se não achar nicho
        if (!nicheData) {
            nicheData = {
                colors: { primary: '#0d6efd', secondary: '#6c757d', accent: '#0dcaf0', background: '#f8f9fa', card_bg: '#ffffff', text: '#212529' },
                hero: { title: "Soluções profissionais para seu negócio", subtitle: "Qualidade e excelência em cada detalhe.", cta: "Saiba Mais" },
                features: ["Atendimento Premium", "Soluções Sob Medida", "Resultados Garantidos"],
                images: {
                    hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
                    about: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
                    feature: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
                }
            };
        }

        // 1.5 Extração de Cores Personalizadas (Se o usuário pediu)
        let customColors = null;
        for (const [colorName, hex] of Object.entries(this.colorMap)) {
            if (lowerText.includes(colorName)) {
                if (!customColors) customColors = { ...nicheData.colors };
                // Heurística: Primeira cor encontrada vira primária, segunda vira secundária
                if (!customColors.modified) {
                    customColors.primary = hex;
                    customColors.modified = true;
                } else {
                    customColors.secondary = hex;
                }
            }
        }
        if (customColors) nicheData.colors = customColors;

        // 1.6 Seleção de Template Visual (Baseado no Nicho)
        let selectedTheme;
        if (nicheData.recommendedTemplates && nicheData.recommendedTemplates.length > 0) {
            // Tenta encontrar os templates recomendados na biblioteca
            const possibleThemes = this.templates.filter(t => nicheData.recommendedTemplates.includes(t.id));
            if (possibleThemes.length > 0) {
                selectedTheme = possibleThemes[Math.floor(Math.random() * possibleThemes.length)];
            }
        }
        
        // Fallback se não houver recomendação ou não encontrar
        if (!selectedTheme) {
            selectedTheme = this.templates[Math.floor(Math.random() * this.templates.length)];
        }

        // 2. Tentar extrair nome do negócio (Heurística simples)
        let brandName = "Sua Empresa";
        
        // Lógica específica para Casamento (Nome e Nome)
        if (detectedNiche === 'casamento') {
             const weddingPatterns = [
                /(?:casamento|site)\s+(?:de|para|dos?)\s+([a-zA-ZÀ-ÿ]+\s+e\s+[a-zA-ZÀ-ÿ]+)/i,
                /([a-zA-ZÀ-ÿ]+\s+e\s+[a-zA-ZÀ-ÿ]+)/i
            ];
            for (const pattern of weddingPatterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    brandName = match[1].replace(/\b\w/g, l => l.toUpperCase());
                    break;
                }
            }
        }

        // Procura padrões como "chama X", "chamada X", "nome é X"
        const namePatterns = [
            /chama\s+([A-Z][a-z0-9\s]+)/i,
            /chamada\s+([A-Z][a-z0-9\s]+)/i,
            /nome\s+(?:é|e)\s+([A-Z][a-z0-9\s]+)/i,
            /empresa\s+([A-Z][a-z0-9\s]+)/i,
            /sou\s+(?:o|a)\s+([A-Z][a-z0-9\s]+)/i
        ];

        if (brandName === "Sua Empresa") {
            for (const pattern of namePatterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    // Pega as primeiras 3 palavras para não pegar frase inteira
                    brandName = match[1].split(' ').slice(0, 3).join(' ').trim();
                    break;
                }
            }
        }

        // Se o usuário digitou pouco texto e parece um nome (ex: "Pizzaria do João")
        if (brandName === "Sua Empresa" && text.length < 40) {
            brandName = text.split(' ').slice(0, 4).join(' ').trim();
        }

        // 3. Montar o JSON Final (Estrutura compatível com generated.html)
        return {
            brandName: brandName,
            niche: detectedNiche,
            templateSource: selectedTheme.name, // Para mostrar no chat
            colors: nicheData.colors,
            fonts: {
                heading: selectedTheme.fontHead,
                body: selectedTheme.fontBody
            },
            customCss: selectedTheme.css, // Injeta CSS do tema escolhido
            hero: {
                title: nicheData.hero.title,
                subtitle: nicheData.hero.subtitle,
                cta: nicheData.hero.cta
            },
            about: {
                title: `Sobre a ${brandName}`,
                text: `Somos referência em ${detectedNiche === 'generico' ? 'nossa área de atuação' : detectedNiche}. Nossa missão é entregar o melhor serviço com qualidade e dedicação total aos nossos clientes. Contamos com uma equipe preparada para atender suas necessidades.`,
                stats: [
                    { number: "100%", label: "Satisfação" },
                    { number: "24/7", label: "Suporte" },
                    { number: "50+", label: "Projetos" }
                ]
            },
            services: nicheData.features.map((f, i) => ({
                title: f,
                desc: "Oferecemos este serviço com a máxima qualidade, utilizando as melhores práticas do mercado para garantir sua satisfação.",
                icon: i === 0 ? "bi-star-fill" : (i === 1 ? "bi-lightning-fill" : "bi-shield-check")
            })),
            features: [
                { title: "Experiência Comprovada", desc: "Anos de mercado entregando resultados consistentes.", icon: "bi-trophy" },
                { title: "Foco no Cliente", desc: "Sua satisfação é nossa prioridade número um.", icon: "bi-heart" },
                { title: "Tecnologia de Ponta", desc: "Utilizamos as ferramentas mais modernas.", icon: "bi-cpu" }
            ],
            portfolio: [
                { title: "Projeto Alpha", category: "Destaque" },
                { title: "Cliente Beta", category: "Recente" },
                { title: "Case Gamma", category: "Premium" }
            ],
            testimonials: [
                { text: "Serviço incrível! Superou minhas expectativas.", name: "Maria Silva", role: "Cliente" },
                { text: "Profissionais altamente qualificados.", name: "João Santos", role: "Empresário" },
                { text: "Recomendo a todos, qualidade impecável.", name: "Ana Costa", role: "Diretora" }
            ],
            contact: {
                email: "contato@" + brandName.toLowerCase().replace(/[^a-z0-9]/g, '') + ".com.br",
                phone: "(11) 99999-9999",
                address: "Av. Principal, 1000 - Centro",
                cta_text: "Falar no WhatsApp"
            },
            sectionTitles: {
                services: "Nossos Serviços",
                services_subtitle: "O que oferecemos de melhor para você",
                portfolio: "Nosso Portfólio",
                portfolio_subtitle: "Conheça nossos trabalhos recentes",
                features: "Diferenciais",
                testimonials: "Depoimentos",
                contact: "Entre em Contato",
                contact_subtitle: "Estamos prontos para te atender"
            },
            images: nicheData.images,
            // Estrutura visual sugerida
            layout: {
                headerStyle: selectedTheme.hero === 'center' ? "transparent" : "solid",
                heroHeight: "full",
                heroStyle: selectedTheme.hero
            }
        };
    }
};
