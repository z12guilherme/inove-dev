# 📋 Snippets Prontos para Copiar e Colar

Use este arquivo para copiar rapidamente componentes animados!

---

## 🎨 Seção de Herói com Animação

```html
<section id="hero" class="hero-section">
    <div class="container text-center position-relative">
        <div class="scroll-fade-in-down animate-delay-100">
            <h1 class="display-4 fw-bold mb-3">
                Seu Título Principal
            </h1>
        </div>
        <div class="scroll-fade-in-up animate-delay-300">
            <p class="lead mb-4">Sua descrição aqui</p>
            <button class="btn btn-primary btn-lg hover-lift">
                <i class="bi bi-rocket-takeoff"></i> CTA Principal
            </button>
        </div>
    </div>
</section>
```

---

## 🏢 Seção de Serviços com Cards

```html
<section id="services" class="services section-bg">
    <div class="container">
        <div class="section-title scroll-zoom-in">
            <h2>Nossos Serviços</h2>
            <p>Soluções completas para seu negócio</p>
        </div>

        <div class="row">
            <div class="col-md-6 col-lg-3 scroll-fade-in-up animate-delay-100">
                <div class="service-card hover-lift">
                    <div class="icon-wrapper">
                        <i class="bi bi-code-slash text-primary"></i>
                    </div>
                    <h5 class="fw-bold mt-3">Serviço 1</h5>
                    <p>Descrição do serviço 1</p>
                    <a href="#" class="btn btn-outline-primary btn-sm">Saiba mais</a>
                </div>
            </div>

            <div class="col-md-6 col-lg-3 scroll-fade-in-up animate-delay-200">
                <div class="service-card hover-lift">
                    <div class="icon-wrapper">
                        <i class="bi bi-cart4 text-success"></i>
                    </div>
                    <h5 class="fw-bold mt-3">Serviço 2</h5>
                    <p>Descrição do serviço 2</p>
                    <a href="#" class="btn btn-outline-success btn-sm">Saiba mais</a>
                </div>
            </div>

            <div class="col-md-6 col-lg-3 scroll-fade-in-up animate-delay-300">
                <div class="service-card hover-lift">
                    <div class="icon-wrapper">
                        <i class="bi bi-laptop text-info"></i>
                    </div>
                    <h5 class="fw-bold mt-3">Serviço 3</h5>
                    <p>Descrição do serviço 3</p>
                    <a href="#" class="btn btn-outline-info btn-sm">Saiba mais</a>
                </div>
            </div>

            <div class="col-md-6 col-lg-3 scroll-fade-in-up animate-delay-400">
                <div class="service-card hover-lift">
                    <div class="icon-wrapper">
                        <i class="bi bi-tools text-warning"></i>
                    </div>
                    <h5 class="fw-bold mt-3">Serviço 4</h5>
                    <p>Descrição do serviço 4</p>
                    <a href="#" class="btn btn-outline-warning btn-sm">Saiba mais</a>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.service-card {
    padding: 30px 20px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: all 0.3s ease;
}

.icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00C7B7 0%, #009f92 100%);
    color: #fff;
    font-size: 28px;
}
</style>
```

---

## 🖼️ Seção de Portfolio/Projetos

```html
<section id="portfolio" class="portfolio">
    <div class="container">
        <div class="section-title scroll-zoom-in">
            <h2>Portfólio</h2>
            <p>Veja nossos trabalhos incríveis</p>
        </div>

        <div class="row">
            <div class="col-lg-4 col-md-6 mb-4 scroll-slide-in-left animate-delay-100">
                <div class="portfolio-card hover-lift">
                    <div class="portfolio-image" style="height: 250px; overflow: hidden; border-radius: 12px;">
                        <img src="projeto1.jpg" class="w-100 h-100" style="object-fit: cover;" alt="Projeto 1">
                    </div>
                    <h5 class="fw-bold mt-3">Projeto 1</h5>
                    <p class="text-muted">Descrição do projeto</p>
                    <a href="#" class="btn btn-sm btn-primary">Ver Projeto →</a>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4 scroll-slide-in-right animate-delay-200">
                <div class="portfolio-card hover-lift">
                    <div class="portfolio-image" style="height: 250px; overflow: hidden; border-radius: 12px;">
                        <img src="projeto2.jpg" class="w-100 h-100" style="object-fit: cover;" alt="Projeto 2">
                    </div>
                    <h5 class="fw-bold mt-3">Projeto 2</h5>
                    <p class="text-muted">Descrição do projeto</p>
                    <a href="#" class="btn btn-sm btn-primary">Ver Projeto →</a>
                </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4 scroll-slide-in-left animate-delay-300">
                <div class="portfolio-card hover-lift">
                    <div class="portfolio-image" style="height: 250px; overflow: hidden; border-radius: 12px;">
                        <img src="projeto3.jpg" class="w-100 h-100" style="object-fit: cover;" alt="Projeto 3">
                    </div>
                    <h5 class="fw-bold mt-3">Projeto 3</h5>
                    <p class="text-muted">Descrição do projeto</p>
                    <a href="#" class="btn btn-sm btn-primary">Ver Projeto →</a>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.portfolio-card {
    padding: 0;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.portfolio-card:hover {
    box-shadow: 0 10px 30px rgba(0, 199, 183, 0.2);
}

.portfolio-card > div:not(.portfolio-image) {
    padding: 20px;
}
</style>
```

---

## 📊 Seção de Estatísticas/Números

```html
<section class="stats section-bg" style="background: linear-gradient(135deg, #0D1B2A 0%, #1a2940 100%);">
    <div class="container">
        <div class="row text-center">
            <div class="col-md-3 scroll-zoom-in animate-delay-100">
                <div class="stat-card text-white">
                    <h3 class="display-5 fw-bold text-primary">150+</h3>
                    <p>Projetos Entregues</p>
                </div>
            </div>
            <div class="col-md-3 scroll-zoom-in animate-delay-200">
                <div class="stat-card text-white">
                    <h3 class="display-5 fw-bold text-success">98%</h3>
                    <p>Clientes Satisfeitos</p>
                </div>
            </div>
            <div class="col-md-3 scroll-zoom-in animate-delay-300">
                <div class="stat-card text-white">
                    <h3 class="display-5 fw-bold text-info">50+</h3>
                    <p>Equipe Dedica</p>
                </div>
            </div>
            <div class="col-md-3 scroll-zoom-in animate-delay-400">
                <div class="stat-card text-white">
                    <h3 class="display-5 fw-bold text-warning">10+</h3>
                    <p>Anos de Experiência</p>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.stat-card {
    padding: 30px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
```

---

## 💬 Seção de Depoimentos/Testimonials

```html
<section id="testimonials" class="testimonials section-bg">
    <div class="container">
        <div class="section-title scroll-zoom-in">
            <h2>O que nossos clientes dizem</h2>
            <p>Histórias de sucesso reais</p>
        </div>

        <div class="row">
            <div class="col-lg-4 scroll-fade-in-up animate-delay-100">
                <div class="testimonial-card hover-shadow">
                    <div class="stars mb-3">
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                    </div>
                    <p class="mb-3">"Excelente trabalho! Recomendo muito!"</p>
                    <div class="author d-flex align-items-center">
                        <img src="cliente1.jpg" class="rounded-circle me-3" alt="Cliente 1" style="width: 40px; height: 40px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">João Silva</h6>
                            <small class="text-muted">CEO Empresa X</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 scroll-fade-in-up animate-delay-200">
                <div class="testimonial-card hover-shadow">
                    <div class="stars mb-3">
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                    </div>
                    <p class="mb-3">"Profissional e dedicado. Voltaria a trabalhar!"</p>
                    <div class="author d-flex align-items-center">
                        <img src="cliente2.jpg" class="rounded-circle me-3" alt="Cliente 2" style="width: 40px; height: 40px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">Maria Santos</h6>
                            <small class="text-muted">Gerente Marketing</small>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 scroll-fade-in-up animate-delay-300">
                <div class="testimonial-card hover-shadow">
                    <div class="stars mb-3">
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                        <i class="bi bi-star-fill text-warning"></i>
                    </div>
                    <p class="mb-3">"Surpreendeu nossas expectativas!"</p>
                    <div class="author d-flex align-items-center">
                        <img src="cliente3.jpg" class="rounded-circle me-3" alt="Cliente 3" style="width: 40px; height: 40px; object-fit: cover;">
                        <div>
                            <h6 class="mb-0">Pedro Costa</h6>
                            <small class="text-muted">Diretor Operacional</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.testimonial-card {
    padding: 25px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #00C7B7;
    transition: all 0.3s ease;
}

.testimonial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 199, 183, 0.2);
}
</style>
```

---

## 📝 Seção de Features/Funcionalidades

```html
<section id="features" class="features section-bg">
    <div class="container">
        <div class="section-title scroll-zoom-in">
            <h2>Recursos Principais</h2>
            <p>Tudo que você precisa</p>
        </div>

        <div class="row">
            <div class="col-lg-6 mb-5 scroll-fade-in-left animate-delay-100">
                <div class="feature-item d-flex">
                    <div class="feature-icon me-4">
                        <div class="icon-box">
                            <i class="bi bi-lightning-charge"></i>
                        </div>
                    </div>
                    <div class="feature-content">
                        <h5 class="fw-bold">Feature 1</h5>
                        <p>Descrição da feature 1 aqui</p>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 mb-5 scroll-fade-in-right animate-delay-200">
                <div class="feature-item d-flex">
                    <div class="feature-icon me-4">
                        <div class="icon-box">
                            <i class="bi bi-shield-check"></i>
                        </div>
                    </div>
                    <div class="feature-content">
                        <h5 class="fw-bold">Feature 2</h5>
                        <p>Descrição da feature 2 aqui</p>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 mb-5 scroll-fade-in-left animate-delay-300">
                <div class="feature-item d-flex">
                    <div class="feature-icon me-4">
                        <div class="icon-box">
                            <i class="bi bi-graph-up"></i>
                        </div>
                    </div>
                    <div class="feature-content">
                        <h5 class="fw-bold">Feature 3</h5>
                        <p>Descrição da feature 3 aqui</p>
                    </div>
                </div>
            </div>

            <div class="col-lg-6 mb-5 scroll-fade-in-right animate-delay-400">
                <div class="feature-item d-flex">
                    <div class="feature-icon me-4">
                        <div class="icon-box">
                            <i class="bi bi-person-check"></i>
                        </div>
                    </div>
                    <div class="feature-content">
                        <h5 class="fw-bold">Feature 4</h5>
                        <p>Descrição da feature 4 aqui</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.icon-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00C7B7 0%, #009f92 100%);
    color: #fff;
    font-size: 24px;
    transition: all 0.3s ease;
}

.feature-item:hover .icon-box {
    transform: scale(1.15) rotate(-10deg);
}
</style>
```

---

## 🎯 Seção CTA (Call To Action)

```html
<section class="cta section-bg" style="background: linear-gradient(135deg, #00C7B7 0%, #009f92 100%);">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-7 scroll-fade-in-left">
                <h2 class="fw-bold text-white mb-3 display-5">Pronto para começar?</h2>
                <p class="lead text-white-50 mb-0">Não deixe para depois. Comece seu projeto hoje mesmo!</p>
            </div>
            <div class="col-lg-5 text-lg-right scroll-fade-in-right">
                <button class="btn btn-light btn-lg hover-lift" onclick="location.hash='#contact'">
                    <i class="bi bi-rocket-takeoff me-2"></i> Começar Agora
                </button>
            </div>
        </div>
    </div>
</section>

<style>
.cta {
    padding: 80px 0;
    text-align: center;
}

@media (min-width: 992px) {
    .cta {
        text-align: left;
    }
    .cta .text-lg-right {
        text-align: right;
    }
}
</style>
```

---

## 📞 Seção de Contato com Formulário

```html
<section id="contact" class="contact section-bg">
    <div class="container">
        <div class="section-title scroll-zoom-in">
            <h2>Entre em Contato</h2>
            <p>Nos chame, responderemos em breve!</p>
        </div>

        <div class="row">
            <div class="col-lg-6 scroll-fade-in-left">
                <form class="contact-form">
                    <div class="mb-3 scroll-fade-in-up animate-delay-100">
                        <label for="name" class="form-label">Nome Completo</label>
                        <input type="text" class="form-control" id="name" required>
                    </div>
                    <div class="mb-3 scroll-fade-in-up animate-delay-200">
                        <label for="email" class="form-label">E-mail</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                    <div class="mb-3 scroll-fade-in-up animate-delay-300">
                        <label for="subject" class="form-label">Assunto</label>
                        <input type="text" class="form-control" id="subject" required>
                    </div>
                    <div class="mb-3 scroll-fade-in-up animate-delay-400">
                        <label for="message" class="form-label">Mensagem</label>
                        <textarea class="form-control" id="message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg hover-lift scroll-fade-in-up animate-delay-500">
                        <i class="bi bi-send me-2"></i> Enviar Mensagem
                    </button>
                </form>
            </div>

            <div class="col-lg-6 scroll-fade-in-right">
                <div class="contact-info">
                    <div class="info-item mb-4 scroll-fade-in-up animate-delay-100">
                        <i class="bi bi-geo-alt text-primary fs-4 me-3"></i>
                        <div>
                            <h5>Localização</h5>
                            <p>Sua Cidade, Estado, País</p>
                        </div>
                    </div>
                    <div class="info-item mb-4 scroll-fade-in-up animate-delay-200">
                        <i class="bi bi-telephone text-primary fs-4 me-3"></i>
                        <div>
                            <h5>Telefone</h5>
                            <p>(XX) XXXXX-XXXX</p>
                        </div>
                    </div>
                    <div class="info-item mb-4 scroll-fade-in-up animate-delay-300">
                        <i class="bi bi-envelope text-primary fs-4 me-3"></i>
                        <div>
                            <h5>E-mail</h5>
                            <p>seu@email.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
.contact-form input,
.contact-form textarea {
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    transition: all 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
    border-color: #00C7B7;
    box-shadow: 0 0 0 3px rgba(0, 199, 183, 0.1);
}

.info-item {
    display: flex;
    align-items: flex-start;
}

.info-item h5 {
    color: #0D1B2A;
    font-weight: 600;
}
</style>
```

---

## 🎬 Footer Animado

```html
<footer class="footer section-bg" style="background: #0D1B2A; color: #fff;">
    <div class="container">
        <div class="row py-5">
            <div class="col-lg-4 mb-4 mb-lg-0 scroll-fade-in-left animate-delay-100">
                <h5 class="fw-bold mb-3">Empresa</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">Sobre Nós</a></li>
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">Portfólio</a></li>
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">Blog</a></li>
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">Contato</a></li>
                </ul>
            </div>

            <div class="col-lg-4 mb-4 mb-lg-0 scroll-fade-in-up animate-delay-200">
                <h5 class="fw-bold mb-3">Serviços</h5>
                <ul class="list-unstyled">
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">Criação de Sites</a></li>
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">E-commerce</a></li>
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">Sistemas Web</a></li>
                    <li class="mb-2"><a href="#" class="text-white-50 hover-lift">Suporte</a></li>
                </ul>
            </div>

            <div class="col-lg-4 scroll-fade-in-right animate-delay-300">
                <h5 class="fw-bold mb-3">Redes Sociais</h5>
                <div class="social-links">
                    <a href="#" class="btn btn-sm btn-outline-light hover-scale me-2">
                        <i class="bi bi-facebook"></i>
                    </a>
                    <a href="#" class="btn btn-sm btn-outline-light hover-scale me-2">
                        <i class="bi bi-instagram"></i>
                    </a>
                    <a href="#" class="btn btn-sm btn-outline-light hover-scale me-2">
                        <i class="bi bi-linkedin"></i>
                    </a>
                    <a href="#" class="btn btn-sm btn-outline-light hover-scale">
                        <i class="bi bi-github"></i>
                    </a>
                </div>
            </div>
        </div>

        <hr class="border-secondary">

        <div class="row py-3">
            <div class="col-md-6">
                <p class="mb-0">&copy; 2024 Sua Empresa. Todos os direitos reservados.</p>
            </div>
            <div class="col-md-6 text-md-end">
                <a href="#" class="text-white-50 me-3 scroll-fade-in-up">Privacidade</a>
                <a href="#" class="text-white-50 scroll-fade-in-up">Termos</a>
            </div>
        </div>
    </div>
</footer>
```

---

Aproveite esses snippets como base para seu site! 🚀✨
