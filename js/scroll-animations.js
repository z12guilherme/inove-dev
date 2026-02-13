/**
 * Scroll Animations
 * Detecta elementos na viewport e ativa animações CSS
 * Usa Intersection Observer API para melhor performance
 */

(function() {
    'use strict';

    // Configuração do Intersection Observer
    const observerConfig = {
        threshold: 0.1, // Ativa quando 10% do elemento está visível
        rootMargin: '0px 0px -100px 0px' // Ativa 100px antes de chegar na base da viewport
    };

    // Callback quando o elemento entra na viewport
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe 'active' para ativar as animações
                entry.target.classList.add('active');
                
                // Desativa o observer após ativar (otimização)
                if (entry.target.dataset.once !== 'false') {
                    observer.unobserve(entry.target);
                }
            }
        });
    };

    // Cria o observer
    const observer = new IntersectionObserver(observerCallback, observerConfig);

    // Inicializa as animações
    function initScrollAnimations() {
        // Seleciona todos os elementos com classe de scroll-animate
        const animatedElements = document.querySelectorAll(
            '[class*="scroll-"], ' +
            '[class*="animate-"], ' +
            '.section-title, ' +
            '.icon-box, ' +
            '.portfolio-item, ' +
            '.process-step, ' +
            '.pricing-card, ' +
            '.team-member, ' +
            '.testimonial-item, ' +
            '.feature-box'
        );

        animatedElements.forEach(element => {
            // Pula elementos que já tem 'active' (carregou da página)
            if (!element.classList.contains('active')) {
                observer.observe(element);
            }
        });

        // Adiciona animações aos elementos que não têm classe de animate
        addDefaultAnimations();
    }

    // Adiciona animações padrão aos elementos
    function addDefaultAnimations() {
        // Adiciona fade-in-up aos cards de serviços
        const serviceCards = document.querySelectorAll('.icon-box');
        serviceCards.forEach((card, index) => {
            if (!card.classList.contains('active')) {
                card.classList.add('scroll-fade-in-up', `animate-delay-${(index + 1) * 100}`);
                observer.observe(card);
            }
        });

        // Adiciona slide-in aos itens do portfólio
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach((item, index) => {
            if (!item.classList.contains('active')) {
                const animationClass = index % 2 === 0 ? 'scroll-slide-in-left' : 'scroll-slide-in-right';
                item.classList.add(animationClass, `animate-delay-${(index + 1) * 100}`);
                observer.observe(item);
            }
        });

        // Adiciona bounce aos passos do processo
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach((step, index) => {
            if (!step.classList.contains('active')) {
                step.classList.add('scroll-bounce-up', `animate-delay-${(index + 1) * 100}`);
                observer.observe(step);
            }
        });

        // Adiciona zoom aos títulos das seções
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            if (!title.classList.contains('active')) {
                title.classList.add('scroll-zoom-in');
                observer.observe(title);
            }
        });

        // Adiciona animações aos cards do pricing
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach((card, index) => {
            if (!card.classList.contains('active')) {
                card.classList.add('scroll-fade-in-up', `animate-delay-${(index + 1) * 100}`);
                observer.observe(card);
            }
        });

        // Adiciona animações aos membros do time
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach((member, index) => {
            if (!member.classList.contains('active')) {
                const animationClass = index % 2 === 0 ? 'scroll-fade-in-left' : 'scroll-fade-in-right';
                member.classList.add(animationClass, `animate-delay-${(index + 1) * 100}`);
                observer.observe(member);
            }
        });

        // Adiciona animações aos depoimentos
        const testimonials = document.querySelectorAll('.testimonial-item');
        testimonials.forEach((item, index) => {
            if (!item.classList.contains('active')) {
                item.classList.add('scroll-fade-in-up', `animate-delay-${(index + 1) * 100}`);
                observer.observe(item);
            }
        });

        // Adiciona animações aos feature boxes
        const featureBoxes = document.querySelectorAll('.feature-box');
        featureBoxes.forEach((box, index) => {
            if (!box.classList.contains('active')) {
                box.classList.add('scroll-fade-in-up', `animate-delay-${(index + 1) * 100}`);
                observer.observe(box);
            }
        });

        // Elementos com data-animate específico
        const dataAnimateElements = document.querySelectorAll('[data-animate]');
        dataAnimateElements.forEach(element => {
            if (!element.classList.contains('in-view')) {
                observer.observe(element);
            }
        });
    }

    // Função para detectar parallax scroll
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;

            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = scrollPos * speed;
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Inicializa quando o DOM está pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initScrollAnimations();
            handleParallax();
        });
    } else {
        initScrollAnimations();
        handleParallax();
    }

    // Reinicializa animações após carregamento de conteúdo dinâmico
    window.addEventListener('load', () => {
        initScrollAnimations();
    });

    // Expõe funções globais para uso manual
    window.ScrollAnimations = {
        init: initScrollAnimations,
        observer: observer,
        // Função para animar elementos manualmente
        animate: function(element, animationClass) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            if (element) {
                element.classList.add(animationClass, 'active');
            }
        },
        // Função para observar elemento específico
        observe: function(element) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            if (element) {
                observer.observe(element);
            }
        },
        // Função para desativar observer em elemento
        unobserve: function(element) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            if (element) {
                observer.unobserve(element);
            }
        }
    };

})();
