import re

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = """    <main id="main">

        <!-- Produto 1: Inove Commerce Template (Text Left, Image Right) -->
        <section id="commerce-template-highlight" class="section-bg" style="background-color: #ffffff; padding: 80px 0; overflow: hidden;">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6" data-aos="fade-right">
                        <span class="badge mb-3 px-3 py-2 rounded-pill fw-bold" style="background-color: #f59e0b; color: #fff;"><i class="bi bi-cart-check"></i> E-COMMERCE PREMIUM</span>
                        <h2 class="fw-bold display-5 mb-3 text-dark">Inove Commerce</h2>
                        <p class="lead mb-4 text-secondary">
                            Template de E-commerce robusto, escalável e de alta conversão. Inspirado nos maiores varejistas como <strong>Mercado Livre</strong> e <strong>Americanas</strong>.
                        </p>
                        <div class="row mb-4">
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-truck fs-3 text-primary me-3"></i>
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark">Logística Inteligente</h6>
                                        <small class="text-muted">Cálculo dinâmico via Correios e Loggi</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-credit-card fs-3 text-success me-3"></i>
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark">Checkout Automatizado</h6>
                                        <small class="text-muted">Integração com PIX e Cartões</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul class="list-unstyled mb-4 text-secondary">
                            <li class="mb-2"><i class="bi bi-check2-circle text-warning me-2"></i> <strong>Painel Administrativo:</strong> Gestão independente de produtos, cupons e pedidos.</li>
                            <li class="mb-2"><i class="bi bi-check2-circle text-warning me-2"></i> <strong>UX Premium:</strong> Design responsivo com micro-interações de alta conversão.</li>
                            <li class="mb-2"><i class="bi bi-check2-circle text-warning me-2"></i> <strong>Tecnologia de Ponta:</strong> Next.js 15, SSR, Tailwind CSS e Estado Global.</li>
                        </ul>
                        <div class="d-flex gap-3 flex-wrap">
                            <a href="#contact" class="btn btn-outline-dark btn-lg rounded-pill px-4">
                                Solicitar Orçamento
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 mt-5 mt-lg-0" data-aos="fade-left">
                        <div class="position-relative p-2 bg-white rounded-4 border shadow-lg">
                            <img src="assets/eccomerce.JPG" alt="Inove Commerce Template" class="img-fluid rounded-3" onerror="this.src='https://placehold.co/600x400/f59e0b/FFF?text=Inove+Commerce'">
                            <div class="position-absolute bottom-0 start-0 m-4 p-3 bg-dark bg-opacity-80 backdrop-blur rounded-3 border border-secondary">
                                <div class="d-flex align-items-center gap-3">
                                    <i class="bi bi-lightning-charge-fill text-warning fs-2"></i>
                                    <div class="text-start">
                                        <div class="fw-bold text-white">Alta Conversão</div>
                                        <div class="small text-white-50">SEO e Performance SSR</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Produto 2: Inove SaaS Platform (Text Right, Image Left) -->
        <section id="saas-platform-highlight" class="section-bg" style="background: #f8f9fa; padding: 80px 0; overflow: hidden;">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 order-lg-2" data-aos="fade-left">
                        <span class="badge mb-3 px-3 py-2 rounded-pill fw-bold" style="background-color: #00C7B7; color: #050a12;"><i class="bi bi-clouds-fill"></i> PLATAFORMA SAAS</span>
                        <h2 class="fw-bold display-5 mb-3 text-dark">Precisa de uma loja exclusiva para você?</h2>
                        <h3 class="h4 mb-3 text-primary">Nós também temos a solução!</h3>
                        <p class="lead mb-4 text-secondary">
                            Conheça o <strong>Inove SaaS</strong>. Uma plataforma completa onde você assina e já sai vendendo. Ambiente seguro, escalável e com subdomínio próprio pronto para a sua marca.
                        </p>
                        <div class="row mb-4">
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-hdd-network fs-3 text-primary me-3"></i>
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark">Subdomínios Dinâmicos</h6>
                                        <small class="text-muted">Sua loja: minhamarca.inovedev</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-palette fs-3 text-success me-3"></i>
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark">Construtor Visual</h6>
                                        <small class="text-muted">Personalize com a sua cara</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul class="list-unstyled mb-4 text-secondary">
                            <li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> <strong>Multi-tenant Real:</strong> Seus dados totalmente isolados e seguros no banco.</li>
                            <li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> <strong>Checkout Integrado:</strong> Pagamentos ágeis via Mercado Pago e WhatsApp.</li>
                            <li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> <strong>Alta Performance:</strong> Arquitetura Edge Serverless no Supabase.</li>
                        </ul>
                        <div class="d-flex gap-3 flex-wrap">
                            <a href="https://saas.inovedev.com.br" target="_blank"
                                class="btn btn-primary btn-lg rounded-pill px-4 shadow-lg border-0"
                                style="background-color: #00C7B7; color: #050a12; font-weight: bold;">
                                <i class="bi bi-rocket-takeoff me-2"></i> Crie sua Loja Agora
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 order-lg-1 mt-5 mt-lg-0" data-aos="fade-right">
                        <div class="position-relative p-2 bg-white rounded-4 border shadow-lg">
                            <img src="assets/saas.jpg" alt="Dashboard Inove SaaS" class="img-fluid rounded-3" onerror="this.src='https://placehold.co/600x400/00C7B7/FFF?text=Inove+SaaS'">
                            <div class="position-absolute bottom-0 end-0 m-4 p-3 bg-dark bg-opacity-80 backdrop-blur rounded-3 border border-secondary">
                                <div class="d-flex align-items-center gap-3">
                                    <i class="bi bi-database-fill-gear text-info fs-2"></i>
                                    <div class="text-start">
                                        <div class="fw-bold text-white">Pronto para Usar</div>
                                        <div class="small text-white-50">Assine e comece a vender</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Produto 3: GestãoRH Highlight Section (Text Left, Image Right) -->
        <section id="gestaorh-highlight" class="section-bg" style="background: #ffffff; padding: 80px 0;">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6" data-aos="fade-right">
                        <span class="badge mb-3 px-3 py-2 rounded-pill fw-bold"
                            style="background-color: #00C7B7; color: white;"><i class="bi bi-people-fill"></i> SISTEMA
                            CORPORATIVO</span>
                        <h2 class="fw-bold display-5 mb-3 text-dark">GestãoRH: Seu DP no Piloto Automático</h2>
                        <p class="lead mb-4 text-secondary">
                            Uma plataforma completa (All-in-One) que une Ponto Eletrônico, Admissão Digital,
                            Recrutamento e uma Inteligência Artificial exclusiva para modernizar a jornada do
                            colaborador.
                        </p>
                        <ul class="list-unstyled mb-4 text-secondary">
                            <li class="mb-3">
                                <div class="d-flex align-items-start">
                                    <i class="bi bi-robot fs-4 text-primary me-3 mt-1"></i>
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Assistente Virtual com IA</h6>
                                        <small class="text-muted">Deixe a IA executar tarefas no banco de dados com
                                            comandos de texto.</small>
                                    </div>
                                </div>
                            </li>
                            <li class="mb-3">
                                <div class="d-flex align-items-start">
                                    <i class="bi bi-geo-alt-fill fs-4 text-success me-3 mt-1"></i>
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Ponto Eletrônico com Geo</h6>
                                        <small class="text-muted">Registro de ponto com captura de localização exata por
                                            GPS e PWA Offline.</small>
                                    </div>
                                </div>
                            </li>
                            <li class="mb-3">
                                <div class="d-flex align-items-start">
                                    <i class="bi bi-file-earmark-lock-fill fs-4 text-info me-3 mt-1"></i>
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Holerite e Dossiê Digital</h6>
                                        <small class="text-muted">Assinatura digital com validade jurídica e
                                            armazenamento em nuvem (LGPD).</small>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="d-flex gap-3 flex-wrap">
                            <a href="https://gestaorecursoshumanos.vercel.app/" target="_blank"
                                class="btn btn-dark btn-lg rounded-pill px-4 shadow-lg border-0"
                                style="background-color: #0D1B2A;">
                                <i class="bi bi-box-arrow-up-right me-2"></i> Acessar GestãoRH
                            </a>
                            <a href="#contact" class="btn btn-outline-dark btn-lg rounded-pill px-4">
                                Falar com Especialista
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 mt-5 mt-lg-0" data-aos="fade-left">
                        <div class="position-relative p-2 bg-white rounded-4 border shadow-lg">
                            <img src="assets/gestaorh.jpg" alt="Dashboard Gestão RH" class="img-fluid rounded-3"
                                onerror="this.src='https://placehold.co/600x400/0D1B2A/FFF?text=Gestão+RH'">
                            <div
                                class="position-absolute bottom-0 end-0 m-4 p-3 bg-white bg-opacity-90 backdrop-blur rounded-3 border border-light shadow-sm">
                                <div class="d-flex align-items-center gap-3">
                                    <i class="bi bi-shield-check text-success fs-2"></i>
                                    <div class="text-start">
                                        <div class="fw-bold text-dark">100% Seguro</div>
                                        <div class="small text-muted">Adequado à LGPD</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Produto 4: Gestão Atípicos Section (Text Right, Image Left) -->
        <section id="gestao-atipicos-highlight" class="section-bg"
            style="background-color: #f8f9fa; padding: 80px 0; overflow: hidden;">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 order-lg-2" data-aos="fade-left">
                        <span class="badge mb-3 px-3 py-2 rounded-pill fw-bold"
                            style="background-color: #7c3aed; color: white;"><i class="bi bi-shield-lock"></i> SEGURANÇA
                            E PRIVACIDADE</span>
                        <h2 class="fw-bold display-5 mb-3 text-dark">Gestão Atípicos</h2>
                        <p class="lead mb-4 text-secondary">
                            Plataforma completa para gestão e acompanhamento de estudantes atípicos. Foco total na
                            <strong>LGPD</strong>, conectando cuidadores, famílias e gestores em um ambiente
                            colaborativo e seguro.
                        </p>
                        <div class="row mb-4">
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-clipboard2-pulse fs-3 text-primary me-3"></i>
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark">Laudos e Histórico</h6>
                                        <small class="text-muted">Visualização segura de documentos</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-phone-fill fs-3 text-success me-3"></i>
                                    <div>
                                        <h6 class="mb-0 fw-bold text-dark">Mobile e Offline</h6>
                                        <small class="text-muted">PWA e Aplicativo Nativo</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul class="list-unstyled mb-4 text-secondary">
                            <li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> <strong>Dashboards
                                    Personalizados:</strong> Acessos para Gestor, Responsável e Cuidador.</li>
                            <li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> <strong>Conformidade
                                    LGPD:</strong> Privacy by Design com controle estrito de acessos.</li>
                            <li class="mb-2"><i class="bi bi-check2-circle text-primary me-2"></i> <strong>Alta
                                    Disponibilidade:</strong> Arquitetura robusta com Supabase.</li>
                        </ul>
                        <div class="d-flex gap-3 flex-wrap">
                            <a href="https://gestao-atipicos.vercel.app" target="_blank"
                                class="btn btn-primary btn-lg rounded-pill px-4 shadow-lg border-0"
                                style="background-color: #7c3aed;">
                                <i class="bi bi-box-arrow-up-right me-2"></i> Ver Sistema em Ação
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 order-lg-1 mt-5 mt-lg-0" data-aos="fade-right">
                        <div class="position-relative p-2 bg-white rounded-4 border shadow-lg">
                            <img src="assets/atipicos.PNG" alt="Dashboard Gestão Atípicos" class="img-fluid rounded-3"
                                onerror="this.src='https://placehold.co/600x400/7c3aed/FFF?text=Gestão+Atípicos'">
                            <div
                                class="position-absolute bottom-0 start-0 m-4 p-3 bg-dark bg-opacity-80 backdrop-blur rounded-3 border border-secondary">
                                <div class="d-flex align-items-center gap-3">
                                    <i class="bi bi-shield-check text-success fs-2"></i>
                                    <div class="text-start">
                                        <div class="fw-bold text-white">100% Protegido</div>
                                        <div class="small text-white-50">Dados Sensíveis Criptografados</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Custom Software CTA -->"""

content = re.sub(r'<main id="main">.*?<!-- Custom Software CTA -->', new_content, content, flags=re.DOTALL)

nav_old = """                    <li><a class="nav-link scrollto" href="#saas-platform-highlight"
                            style="color: #00C7B7; font-weight: bold;">Inove SaaS</a></li>
                    <li><a class="nav-link scrollto" href="#commerce-template-highlight"
                            style="color: #00C7B7; font-weight: bold;">Inove Commerce</a></li>"""
nav_new = """                    <li><a class="nav-link scrollto" href="#commerce-template-highlight"
                            style="color: #00C7B7; font-weight: bold;">Inove Commerce</a></li>
                    <li><a class="nav-link scrollto" href="#saas-platform-highlight"
                            style="color: #00C7B7; font-weight: bold;">Inove SaaS</a></li>"""

content = content.replace(nav_old, nav_new)

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Main content updated to swap Commerce Template and SaaS.")
