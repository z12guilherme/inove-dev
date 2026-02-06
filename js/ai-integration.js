/**
 * Inove AI Integration Script
 * Este script deve ser adicionado ao final do <body> de qualquer template baixado (BootstrapMade, etc).
 * Ele lê os dados gerados pela IA e preenche o template automaticamente.
 * Uso: <script src="../../js/ai-integration.js"></script>
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🤖 Inove AI: Tentando hidratar o template...");

    // 1. Tenta recuperar ID da URL
    const urlParams = new URLSearchParams(window.location.search);
    const siteId = urlParams.get('id');
    
    let data = null;
    let storageKey = 'aiWebsiteData_v3'; // Chave padrão

    // 1.1 Tenta recuperar estado da URL (Hash) - Para links compartilhados com modificações
    if (window.location.hash.startsWith('#s=')) {
        try {
            const stateParam = window.location.hash.substring(3);
            const binary = atob(stateParam);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            data = JSON.parse(new TextDecoder().decode(bytes));
            console.log("🤖 Inove AI: Estado carregado da URL (Link Compartilhado).");
        } catch (e) {
            console.error("Erro ao decodificar estado da URL:", e);
        }
    }

    if (siteId && !data) {
        storageKey = `ai_site_${siteId}`;
        data = JSON.parse(localStorage.getItem(storageKey));
    }

    // 2. Fallback para o último gerado se não tiver ID
    if (!data) {
        data = JSON.parse(localStorage.getItem('aiWebsiteData_v3'));
        storageKey = 'aiWebsiteData_v3';
    }

    if (!data) {
        console.warn("🤖 Inove AI: Nenhum dado encontrado no LocalStorage.");
        return;
    }

    // --- FUNÇÃO DE SALVAMENTO ---
    const saveToLocal = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn("Inove AI: Não foi possível salvar no LocalStorage (Bloqueado pelo navegador).");
        }
    };

    // --- HELPER: Gerador de Seletor Único (Para persistência de edições livres) ---
    const getUniqueSelector = (el) => {
        if (el.id) return '#' + el.id;
        if (el === document.body) return 'body';
        let path = [];
        while (el.parentNode && el !== document.body) {
            if (el.id) {
                path.unshift('#' + el.id);
                break;
            }
            let selector = el.tagName.toLowerCase();
            let sib = el;
            let nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.tagName.toLowerCase() === selector) nth++;
            }
            if (nth > 1) selector += `:nth-of-type(${nth})`;
            path.unshift(selector);
            el = el.parentNode;
        }
        if (el === document.body && path.length > 0 && !path[0].startsWith('#')) path.unshift('body');
        return path.join(' > ');
    };

    // --- INJEÇÃO DA BARRA DE FERRAMENTAS (STUDIO) ---
    const injectStudioToolbar = () => {
        // 1. CSS
        const style = document.createElement('style');
        style.textContent = `
            .studio-toolbar {
                background: #0D1B2A; color: white; padding: 5px 15px; position: fixed; top: 0; left: 0; right: 0;
                z-index: 99999; display: flex; justify-content: space-between; align-items: center;
                font-family: sans-serif; font-size: 12px; border-bottom: 2px solid var(--primary, #0d6efd); height: 45px;
            }
            body { padding-top: 45px !important; }
            [contenteditable="true"]:hover { outline: 2px dashed var(--primary, #0d6efd); cursor: text; }
            [contenteditable="true"]:focus { outline: 2px solid var(--primary, #0d6efd); background: rgba(13, 110, 253, 0.05); }
            .color-control { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
            .color-control label { font-size: 9px; text-transform: uppercase; opacity: 0.8; margin: 0; font-weight: 700; color: white; }
            .color-control input[type="color"] { width: 22px; height: 18px; padding: 0; border: none; background: none; cursor: pointer; }
            .studio-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 14px; padding: 0 5px; }
            .studio-btn:hover { color: white; }
            .studio-btn.finalize { background: var(--primary, #0d6efd); color: white; font-weight: bold; font-size: 10px; padding: 4px 10px; border-radius: 4px; margin-left: 10px; }
            
            /* Context Menu & Selection */
            .studio-context-menu {
                position: absolute; display: none; gap: 5px; background: #0D1B2A; padding: 6px;
                border-radius: 50px; z-index: 100000; box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                border: 1px solid var(--primary, #0d6efd); transform: translate(-50%, -120%);
            }
            .studio-context-menu button {
                background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer; 
                width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                transition: 0.2s; font-size: 12px;
            }
            .studio-context-menu button:hover { background: var(--primary, #0d6efd); transform: scale(1.1); }
            .studio-context-menu button.delete:hover { background: #dc3545; }
            
            .studio-selected { outline: 2px solid var(--primary, #0d6efd) !important; position: relative; z-index: 9990; cursor: pointer; }
            .studio-hover { outline: 2px dashed rgba(13, 110, 253, 0.4) !important; cursor: pointer; }
        `;
        document.head.appendChild(style);

        // 2. HTML
        const toolbar = document.createElement('div');
        toolbar.className = 'studio-toolbar';
        toolbar.innerHTML = `
            <div style="display:flex; align-items:center;">
                <strong style="margin-right:10px;">Inove AI Studio</strong>
                <span style="background:var(--primary); font-size:9px; padding:2px 5px; border-radius:3px;">EDITANDO</span>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <div class="color-control">
                    <label>Marca</label>
                    <input type="color" id="pickerPrimary" value="${data.colors?.primary || '#0d6efd'}">
                </div>
                <div class="color-control">
                    <label>Fundo</label>
                    <input type="color" id="pickerBg" value="${data.colors?.background || '#ffffff'}">
                </div>
                <div class="color-control">
                    <label>Texto</label>
                    <input type="color" id="pickerText" value="${data.colors?.text || '#333333'}">
                </div>
                <button id="btnDownload" class="studio-btn" title="Baixar Código"><i class="bi bi-download"></i></button>
                <button id="btnFinalize" class="studio-btn finalize">FINALIZAR</button>
            </div>
        `;
        document.body.prepend(toolbar);

        // 2.1 Context Menu HTML
        const ctxMenu = document.createElement('div');
        ctxMenu.className = 'studio-context-menu';
        ctxMenu.innerHTML = `
            <button id="ctxUp" title="Mover para Cima"><i class="bi bi-arrow-up"></i></button>
            <button id="ctxDown" title="Mover para Baixo"><i class="bi bi-arrow-down"></i></button>
            <button id="ctxDelete" class="delete" title="Excluir Elemento"><i class="bi bi-trash"></i></button>
        `;
        document.body.appendChild(ctxMenu);

        // 3. Event Listeners da Toolbar
        document.getElementById('pickerPrimary').addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--primary', val);
            // Suporte a Bootstrap 5 e Variáveis Comuns
            document.documentElement.style.setProperty('--bs-primary', val);
            document.documentElement.style.setProperty('--bs-link-color', val);
            
            data.colors.primary = val;
            saveToLocal();
        });
        document.getElementById('pickerBg').addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--bg-page', val);
            // Suporte a Bootstrap 5
            document.documentElement.style.setProperty('--bs-body-bg', val);
            document.body.style.backgroundColor = val;
            
            data.colors.background = val;
            saveToLocal();
        });
        document.getElementById('pickerText').addEventListener('input', (e) => {
            const val = e.target.value;
            document.documentElement.style.setProperty('--text-main', val);
            // Suporte a Bootstrap 5
            document.documentElement.style.setProperty('--bs-body-color', val);
            document.body.style.color = val;
            
            data.colors.text = val;
            saveToLocal();
        });

        // Botão Finalizar (WhatsApp)
        document.getElementById('btnFinalize').addEventListener('click', async function() {
            const btn = this;
            const originalText = btn.innerHTML;
            btn.innerHTML = '...';
            btn.disabled = true;

            const jsonStr = JSON.stringify(data);
            const bytes = new TextEncoder().encode(jsonStr);
            const encodedState = btoa(String.fromCharCode(...bytes));
            // Usa a própria URL do template para o link compartilhado
            const baseUrl = window.location.href.split('?')[0].split('#')[0];
            let shareLink = `${baseUrl}#s=${encodedState}`; 

            try {
                const response = await fetch('/.netlify/functions/shorten', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: shareLink })
                });
                const resData = await response.json();
                if (response.ok && resData.result) shareLink = resData.result;
            } catch (e) {
                console.warn("Erro ao encurtar link", e);
            }

            window.open(`https://wa.me/5581989035561?text=Olha meu site: ${encodeURIComponent(shareLink)}`, '_blank');
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        });

        // Botão Download
        document.getElementById('btnDownload').addEventListener('click', () => {
            const password = prompt("Senha de desenvolvedor:");
            // Hash SHA-256 simples da senha 'Mg156810$' (apenas exemplo, ideal é backend)
            if (password === 'Mg156810$') {
                const htmlContent = document.documentElement.outerHTML;
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `site-${data.brandName}.html`;
                a.click();
            } else if (password) {
                alert("Senha incorreta.");
            }
        });

        // --- LÓGICA DE SELEÇÃO E EDIÇÃO AVANÇADA ---
        let selectedBlock = null;

        // Função para reposicionar o menu
        const updateMenuPos = () => {
            if (!selectedBlock) {
                ctxMenu.style.display = 'none';
                return;
            }
            const rect = selectedBlock.getBoundingClientRect();
            ctxMenu.style.display = 'flex';
            ctxMenu.style.top = (rect.top + window.scrollY) + 'px';
            ctxMenu.style.left = (rect.left + window.scrollX + (rect.width / 2)) + 'px';
        };

        // Listener global de cliques para seleção
        document.addEventListener('click', (e) => {
            // Se clicar na toolbar ou menu, ignora
            if (e.target.closest('.studio-toolbar') || e.target.closest('.studio-context-menu')) return;

            // Tenta encontrar um bloco editável (pai ou o próprio elemento)
            const target = e.target.closest('[data-list-key], [data-path]');
            
            // Remove seleção anterior
            if (selectedBlock && selectedBlock !== target) {
                selectedBlock.classList.remove('studio-selected');
            }

            if (target) {
                // Se for um bloco de lista (card), seleciona ele. Se for texto solto, seleciona também.
                // Prioriza o bloco maior se clicar nele
                selectedBlock = target;
                selectedBlock.classList.add('studio-selected');
                updateMenuPos();
                
                // Habilita botões baseados no tipo
                const isList = selectedBlock.hasAttribute('data-list-key');
                document.getElementById('ctxUp').style.display = isList ? 'flex' : 'none';
                document.getElementById('ctxDown').style.display = isList ? 'flex' : 'none';
                document.getElementById('ctxDelete').style.display = isList ? 'flex' : 'none'; // Só deleta itens de lista por segurança
            } else {
                selectedBlock = null;
                ctxMenu.style.display = 'none';
            }
        });

        // Hover effect
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-list-key], [data-path]');
            if (target && target !== selectedBlock) {
                target.classList.add('studio-hover');
                e.stopPropagation();
            }
        });
        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-list-key], [data-path]');
            if (target) target.classList.remove('studio-hover');
        });

        // Ações do Menu
        const moveItem = (direction) => {
            if (!selectedBlock || !selectedBlock.dataset.listKey) return;
            const listKey = selectedBlock.dataset.listKey;
            const index = parseInt(selectedBlock.dataset.listIndex);
            const list = data[listKey];
            
            if (direction === -1 && index > 0) {
                // Swap Array
                [list[index], list[index-1]] = [list[index-1], list[index]];
                saveToLocal();
                location.reload(); // Recarrega para renderizar na ordem certa (solução simples)
            } else if (direction === 1 && index < list.length - 1) {
                [list[index], list[index+1]] = [list[index+1], list[index]];
                saveToLocal();
                location.reload();
            }
        };

        document.getElementById('ctxUp').addEventListener('click', () => moveItem(-1));
        document.getElementById('ctxDown').addEventListener('click', () => moveItem(1));
        
        document.getElementById('ctxDelete').addEventListener('click', () => {
            if (!selectedBlock || !selectedBlock.dataset.listKey) return;
            if (confirm('Tem certeza que deseja excluir este item?')) {
                const listKey = selectedBlock.dataset.listKey;
                const index = parseInt(selectedBlock.dataset.listIndex);
                data[listKey].splice(index, 1); // Remove do array
                saveToLocal();
                selectedBlock.remove(); // Remove do DOM
                ctxMenu.style.display = 'none';
            }
        });

        // Atualiza posição ao rolar
        window.addEventListener('scroll', updateMenuPos);
    };

    injectStudioToolbar();

    // 1. Mapeamento Inteligente (Tenta encontrar elementos comuns em templates Bootstrap)
    const mappings = [
        // Marca e Títulos
        { selector: '.logo h1, .navbar-brand, title, #fh5co-logo a, .sitename, .sidebar-brand, .couple-name', value: data.brandName, path: 'brandName' },
        { selector: '#hero h1, .hero h1, .banner h1, .fh5co-hero h1, header.masthead h1, .hero-title', value: data.hero?.title, path: 'hero.title' },
        { selector: '#hero h2, #hero p, .hero p, .fh5co-hero h2, header.masthead p, .hero-subtitle', value: data.hero?.subtitle, path: 'hero.subtitle' },
        { selector: '#hero .btn-get-started, .hero .btn-primary, header.masthead .btn-xl, .hero-btn', value: data.hero?.cta, path: 'hero.cta' },
        
        // Sobre
        { selector: '#about h3, .about h3, #about h2, .about-title', value: data.about?.title, path: 'about.title' },
        { selector: '#about p, .about p', value: data.about?.text, path: 'about.text' },
        
        // Contato
        { selector: '.info-box .email p, #contact .email', value: data.contact?.email, path: 'contact.email' },
        { selector: '.info-box .phone p, #contact .phone', value: data.contact?.phone, path: 'contact.phone' },
        { selector: '.info-box .address p, #contact .address', value: data.contact?.address, path: 'contact.address' },
        
        // Cores (CSS Variables - Funciona se o template usar :root)
        { cssVar: '--primary', value: data.colors?.primary },
        { cssVar: '--secondary', value: data.colors?.secondary },
        { cssVar: '--accent', value: data.colors?.accent },

        // Títulos de Seção (Tradução/Personalização)
        { selector: '#services .section-title h2, #services h2, .services-title', value: data.sectionTitles?.services || "Nossos Serviços", path: 'sectionTitles.services' },
        { selector: '#portfolio .section-title h2, #portfolio h2, .portfolio-title', value: data.sectionTitles?.portfolio || "Portfólio", path: 'sectionTitles.portfolio' },
        { selector: '#about .section-title h2', value: "Sobre Nós" },
        { selector: '#contact .section-title h2, #contact h2', value: data.sectionTitles?.contact || "Fale Conosco", path: 'sectionTitles.contact' },
        { selector: '#menu .section-title h2, #menu h2', value: "Nosso Menu" }, // Restaurante
        { selector: '#departments .section-title h2', value: "Departamentos" }, // Medico
        
        // Traduções Específicas de Templates (SnapFolio, Strategy, LeadPage)
        { selector: '.service-heading div:first-child', value: "Soluções de" },
        { selector: '.service-heading div:last-child span', value: "Alta Performance" },
        { selector: '.service-summary p', value: "Integramos estratégias inovadoras e tecnologias de ponta para entregar experiências excepcionais que impulsionam o crescimento do seu negócio." },
        { selector: '.service-btn', value: "Ver Todos os Serviços" },
        { selector: '.section-title div > span:first-child', value: "Confira Nossos" }, // Strategy Template "Check Our"
        { selector: '.description-title', value: "Serviços" }, // Strategy Template "Services"
        { selector: '.subtitle', value: "Destaques" }, // LeadPage "Features" subtitle
        
        // Navegação (Tradução dos Menus)
        { selector: 'nav a[href="#hero"], nav a[href="#home"], nav a[href="index.html"]', value: data.ui?.nav_home || "Início" },
        { selector: 'nav a[href="#about"]', value: data.ui?.nav_about || "Sobre" },
        { selector: 'nav a[href="#services"]', value: data.ui?.nav_services || "Serviços" },
        { selector: 'nav a[href="#portfolio"]', value: data.ui?.nav_portfolio || "Portfólio" },
        { selector: 'nav a[href="#contact"]', value: data.ui?.nav_contact || "Contato" },
        { selector: 'nav a[href="#team"]', value: "Equipe" },
        { selector: 'nav a[href="#blog"]', value: "Blog" },
        
        // Botões Comuns
        { selector: '.btn-getstarted, .btn-get-started', value: data.hero?.cta || "Começar Agora" },
        { selector: '.read-more, .readmore', value: data.ui?.btn_read_more || "Saiba Mais" },

        // Traduções de Formulários e Placeholders
        { selector: 'input[placeholder*="Name"]', attribute: 'placeholder', value: "Seu Nome" },
        { selector: 'input[placeholder*="Email"]', attribute: 'placeholder', value: "Seu Email" },
        { selector: 'input[placeholder*="Subject"]', attribute: 'placeholder', value: "Assunto" },
        { selector: 'textarea[placeholder*="Message"]', attribute: 'placeholder', value: "Sua Mensagem" },
        { selector: 'button[type="submit"]', value: data.ui?.btn_submit || "Enviar Mensagem" },
        { selector: '.loading', value: "Carregando" },
        { selector: '.sent-message', value: "Sua mensagem foi enviada. Obrigado!" }
    ];

    // 2. Executar Substituições de Texto
    mappings.forEach(map => {
        if (map.selector && map.value) {
            const elements = document.querySelectorAll(map.selector);
            elements.forEach(el => {
                // Atributos (ex: placeholder)
                if (map.attribute) {
                    el.setAttribute(map.attribute, map.value);
                    return;
                }
                
                // Lógica especial para menus com ícones (preserva o ícone <i class="...">)
                if (el.tagName === 'A' && el.querySelector('i')) {
                    for (let node of el.childNodes) {
                        if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
                            node.nodeValue = " " + map.value;
                            break;
                        }
                    }
                } 
                // Lógica padrão para textos simples
                else if (el.children.length === 0 || el.tagName.startsWith('H') || el.tagName === 'P' || el.tagName === 'SPAN' || el.tagName === 'DIV' || el.tagName === 'BUTTON') {
                    el.innerText = map.value;
                    
                    // Habilita edição se tiver um caminho mapeado
                    if (map.path) {
                        el.setAttribute('contenteditable', 'true');
                        el.dataset.path = map.path;
                    }
                }
            });
        }
        // Substituição de Cores
        if (map.cssVar && map.value) {
            document.documentElement.style.setProperty(map.cssVar, map.value);
        }
    });

    // 3. Substituição de Imagens (Hero e Sobre)
    if (data.images) {
        const heroBg = document.querySelector('#hero, .hero, header.masthead');
        if (heroBg && data.images.hero) {
            // Tenta aplicar como background-image
            heroBg.style.backgroundImage = `url('${data.images.hero}')`;
        }
        
        const aboutImg = document.querySelector('#about img, .about-img');
        if (aboutImg && data.images.about) {
            aboutImg.src = data.images.about;
        }
    }

    // 4. Preencher Listas (Serviços, Menu, Departamentos) - Modo Melhorado
    if (data.services && data.services.length > 0) {
        // Seleciona cards de serviço em vários templates (Strategy, Medico, Pizza, etc)
        const serviceCards = document.querySelectorAll('.service-item, .service-card, .icon-box, .service-box, #services .col-lg-3, .department-item, .menu-item, .feature-box');
        
        serviceCards.forEach((card, index) => {
            if (index >= data.services.length) return;

            // Marca o bloco para edição (Wix Style)
            card.setAttribute('data-list-key', 'services');
            card.setAttribute('data-list-index', index);
            
            const service = data.services[index];
            
            // Título
            const titleEl = card.querySelector('h3, h4, .title, .service-title, .h4, .menu-content a');
            if (titleEl) {
                const link = titleEl.querySelector('a');
                if (link) link.innerText = service.title;
                else {
                    titleEl.innerText = service.title;
                    titleEl.setAttribute('contenteditable', 'true');
                    titleEl.dataset.path = `services.${index}.title`;
                }
            }
            
            // Descrição
            const descEl = card.querySelector('p, .description, .service-description, .text-muted, .ingredients');
            if (descEl) {
                descEl.innerText = service.desc;
                descEl.setAttribute('contenteditable', 'true');
                descEl.dataset.path = `services.${index}.desc`;
            }
        });
    }

    // 4.1 Preencher Portfólio / Galeria / Produtos
    if (data.portfolio && data.portfolio.length > 0) {
        const portfolioItems = document.querySelectorAll('.portfolio-item, .portfolio-wrap, .portfolio-card, .portfolio-box, .gallery-item, .product-item');
        portfolioItems.forEach((item, index) => {
            if (index >= data.portfolio.length) return;
            
            item.setAttribute('data-list-key', 'portfolio');
            item.setAttribute('data-list-index', index);

            const project = data.portfolio[index];
            const titleEl = item.querySelector('h3, h4, .portfolio-title, .project-name');
            const catEl = item.querySelector('p, span, .portfolio-category, .project-category');

            if (titleEl) {
                titleEl.innerText = project.title;
                titleEl.setAttribute('contenteditable', 'true');
                titleEl.dataset.path = `portfolio.${index}.title`;
            }
            if (catEl) {
                catEl.innerText = project.category;
                catEl.setAttribute('contenteditable', 'true');
                catEl.dataset.path = `portfolio.${index}.category`;
            }
        });
    }

    // 6. Aplicar Edições Manuais Salvas (Overrides)
    if (data.textOverrides) {
        Object.entries(data.textOverrides).forEach(([selector, text]) => {
            try {
                const el = document.querySelector(selector);
                if (el) el.innerText = text;
            } catch (e) {
                console.warn("Erro ao aplicar override:", selector);
            }
        });
    }

    // 7. Habilitar Edição Global (Qualquer texto)
    const enableGlobalEditing = () => {
        const allElements = document.body.querySelectorAll('*');
        allElements.forEach(el => {
            // Ignora elementos da interface do Studio
            if (el.closest('.studio-toolbar') || el.closest('.studio-context-menu') || el.closest('.ai-badge')) return;
            // Ignora tags não visuais
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'PATH', 'BR', 'HR'].includes(el.tagName)) return;

            // Verifica se tem texto direto
            const hasText = Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim().length > 0);
            
            if (hasText && !el.isContentEditable) {
                el.setAttribute('contenteditable', 'true');
                el.style.cursor = 'text';
            }
        });
    };
    enableGlobalEditing();

    console.log("🤖 Inove AI: Template hidratado com sucesso!");

    // Listener Global para Edição de Texto
    document.addEventListener('input', (e) => {
        if (e.target.getAttribute('contenteditable') === 'true') {
            if (e.target.dataset.path) {
                const path = e.target.dataset.path.split('.');
                let current = data;
                for (let i = 0; i < path.length - 1; i++) {
                    if (!current[path[i]]) current[path[i]] = {};
                    current = current[path[i]];
                }
                current[path[path.length - 1]] = e.target.innerText;
            } else {
                // Salva edição livre em textOverrides
                if (!data.textOverrides) data.textOverrides = {};
                const selector = getUniqueSelector(e.target);
                data.textOverrides[selector] = e.target.innerText;
            }
            saveToLocal();
        }
    });

    // 5. Varredura Final de Tradução (Fallback para textos soltos)
    const commonTranslations = {
        "Home": data.ui?.nav_home || "Início", 
        "About": data.ui?.nav_about || "Sobre", 
        "About Us": data.ui?.nav_about || "Sobre Nós",
        "Services": data.ui?.nav_services || "Serviços", 
        "Portfolio": data.ui?.nav_portfolio || "Portfólio", 
        "Contact": data.ui?.nav_contact || "Contato",
        "Team": "Equipe", "Pricing": "Preços", "Blog": "Blog",
        "Read More": data.ui?.btn_read_more || "Leia Mais", 
        "Learn More": data.ui?.btn_read_more || "Saiba Mais", 
        "Get Started": data.hero?.cta || "Começar",
        "Send Message": data.ui?.btn_submit || "Enviar Mensagem", 
        "Subject": "Assunto", "Message": "Mensagem",
        "Your Name": "Seu Nome", "Your Email": "Seu Email", "Call Us": "Ligue para nós",
        "Email Us": "Envie um email", "Location": "Localização", "Open Hours": "Horário",
        "Frequently Asked Questions": "Perguntas Frequentes", "Testimonials": "Depoimentos",
        "Resume": "Currículo", "Skills": "Habilidades", "Summary": "Resumo",
        "Professional Experience": "Experiência Profissional", "Education": "Educação",
        "Certifications": "Certificações", "All": "Todos", "App": "App", "Card": "Cartão",
        "Web": "Web", "Web Design": "Web Design", "Development": "Desenvolvimento",
        "Brand": "Marca", "Design": "Design", "Photography": "Fotografia",
        "Useful Links": "Links Úteis", "Our Services": "Nossos Serviços",
        "Drop Down": "Menu", "Deep Drop Down": "Sub Menu",
        "Search": "Buscar", "Search...": "Buscar...",
        "Loading": "Carregando", "Sent Message": "Mensagem Enviada"
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        const text = node.nodeValue.trim();
        if (commonTranslations[text]) {
            node.nodeValue = commonTranslations[text];
        }
    }

    // 6. Substituição Global de Imagens (Baseada no Nicho)
    const imgKeywords = data.imageKeywords || data.niche || 'business';

    const contentSelectors = [
        '#portfolio img', '.portfolio-item img', '.portfolio-wrap img',
        '#team img', '.team-member img', '.member-img img',
        '#blog img', '.blog-item img', '.post-img img',
        '#services img', '.service-item img', '.portfolio-box img',
        '.hero-img img', '#hero img',
        '.gallery-item img', '.product-item img', '.menu-item img', '.department-item img'
    ];

    const images = document.querySelectorAll(contentSelectors.join(','));

    images.forEach((img, index) => {
        // Evita substituir logo ou ícones muito pequenos
        if (img.closest('.logo') || img.classList.contains('logo') || img.width < 50 || img.height < 50) return;
        
        // Se já foi substituída (contém unsplash ou pollinations), pula
        if (img.src.includes('unsplash.com') || img.src.includes('pollinations.ai')) return;

        // Usa Pollinations AI para gerar imagens reais baseadas no nicho
        const prompt = encodeURIComponent(`${imgKeywords} ${index} professional photography, realistic, 4k`);
        img.src = `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${index}`;
    });

    // Injetar Badge discreto para confirmar que a IA está ativa neste template
    if (!document.querySelector('.ai-badge')) {
        const badge = document.createElement('div');
        badge.className = 'ai-badge';
        badge.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #0D1B2A; color: #fff; padding: 8px 15px; border-radius: 50px; z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-size: 0.75rem; font-family: sans-serif; pointer-events: none; opacity: 0.8;';
        badge.innerHTML = '✨ Powered by Inove AI';
        document.body.appendChild(badge);
    }
});