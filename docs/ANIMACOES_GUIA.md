# 🎬 Guia de Animações CSS - Inove Dev

## 📋 Sumário
- [Animações Disponíveis](#animações-disponíveis)
- [Como Usar](#como-usar)
- [Exemplos Práticos](#exemplos-práticos)
- [Otimizações de Performance](#otimizações-de-performance)

---

## 🎨 Animações Disponíveis

### Fade In (Desvanecer)
- `animate-fade-in` - Surgir com transparência
- `scroll-fade-in` - Ativa ao rolar a página
- `animate-fade-in-up` - Surgir de baixo para cima
- `animate-fade-in-down` - Surgir de cima para baixo
- `animate-fade-in-left` - Surgir da esquerda
- `animate-fade-in-right` - Surgir da direita

### Slide In (Deslizar)
- `animate-slide-in-up` - Deslizar para cima
- `animate-slide-in-down` - Deslizar para baixo
- `animate-slide-in-left` - Deslizar da esquerda
- `animate-slide-in-right` - Deslizar da direita
- `scroll-slide-in-left` - Ativa ao rolar
- `scroll-slide-in-right` - Ativa ao rolar

### Zoom (Aumentar/Diminuir)
- `animate-zoom-in` - Aumentar escala
- `animate-zoom-in-up` - Aumentar e subir
- `scroll-zoom-in` - Ativa ao rolar

### Bounce (Quique)
- `animate-bounce-in` - Efeito de quique
- `animate-bounce-up` - Quique de baixo
- `scroll-bounce-in` - Ativa ao rolar
- `scroll-bounce-up` - Ativa ao rolar

### Flip (Girar)
- `animate-flip-in-x` - Girar horizontalmente
- `animate-flip-in-y` - Girar verticalmente
- `scroll-flip-in-x` - Ativa ao rolar
- `scroll-flip-in-y` - Ativa ao rolar

### Rotate (Rotação)
- `animate-rotate-in` - Girar entrada
- `scroll-rotate-in` - Ativa ao rolar

### Efeitos Contínuos
- `animate-pulse` - Pulsação continua (opacidade)
- `animate-glow` - Brilho continuo (box-shadow)
- `gradient-shift` - Gradiente em movimento

---

## 📚 Como Usar

### 1. Animações Instantâneas (PageLoad)
Use classes `animate-*` para animações que iniciam ao carregar a página:

```html
<!-- Fade In -->
<div class="animate-fade-in">Conteúdo aqui</div>

<!-- Slide In Down -->
<h2 class="animate-slide-in-down">Título</h2>

<!-- Zoom In com delay -->
<div class="animate-zoom-in animate-delay-300">
  Conteúdo com 0.3s de espera
</div>
```

### 2. Animações de Scroll (Recomendado)
Use classes `scroll-*` para animar quando o usuário rolar até o elemento:

```html
<!-- Fade In ao rolar -->
<section class="scroll-fade-in-up">
  Conteúdo surge ao rolar
</section>

<!-- Slide com cascata -->
<div class="scroll-slide-in-left animate-delay-100">Item 1</div>
<div class="scroll-slide-in-left animate-delay-200">Item 2</div>
<div class="scroll-slide-in-left animate-delay-300">Item 3</div>
```

### 3. Combining Classes
Você pode combinar classes para customizar:

```html
<!-- Animação rápida com delay -->
<div class="scroll-fade-in-up animate-duration-500 animate-delay-200">
  Conteúdo
</div>

<!-- Efeito de bouncing com delay em cascata -->
<div class="scroll-bounce-up animate-delay-100">Item 1</div>
<div class="scroll-bounce-up animate-delay-200">Item 2</div>
<div class="scroll-bounce-up animate-delay-300">Item 3</div>
```

### 4. Hover Effects
Adicione efeitos ao passar o mouse:

```html
<!-- Levanta ao passar o mouse -->
<div class="hover-lift">
  Passe o mouse
</div>

<!-- Brilha ao passar o mouse -->
<button class="hover-glow btn btn-primary">
  Clique aqui
</button>

<!-- Aumenta escala -->
<img src="foto.jpg" class="hover-scale" alt="Foto">

<!-- Sombra ao passar -->
<div class="card hover-shadow">
  Card com sombra
</div>
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Seção de Serviços com Cascata
```html
<section id="services">
  <div class="row">
    <div class="col-md-3 scroll-fade-in-up animate-delay-100">
      <div class="service-card hover-lift">
        <i class="bi bi-code-slash"></i>
        <h4>Criação de Sites</h4>
      </div>
    </div>
    <div class="col-md-3 scroll-fade-in-up animate-delay-200">
      <div class="service-card hover-lift">
        <i class="bi bi-cart"></i>
        <h4>E-commerce</h4>
      </div>
    </div>
    <!-- Mais cards... -->
  </div>
</section>
```

### Exemplo 2: Cards de Portfolio
```html
<div class="portfolio-item scroll-slide-in-left">
  <img src="projeto1.jpg" alt="Projeto 1">
  <h4>Projeto 1</h4>
</div>
<div class="portfolio-item scroll-slide-in-right">
  <img src="projeto2.jpg" alt="Projeto 2">
  <h4>Projeto 2</h4>
</div>
```

### Exemplo 3: Seção "Sobre" com Efeito Lateral
```html
<section id="about">
  <div class="row">
    <div class="col-lg-6 scroll-fade-in-left">
      <h2>Sobre Nós</h2>
      <p>Conteúdo...</p>
    </div>
    <div class="col-lg-6 scroll-fade-in-right">
      <img src="sobre.jpg" alt="Sobre">
    </div>
  </div>
</section>
```

### Exemplo 4: Texto com Efeito Wave
```html
<h2>
  <span class="wave-animation">S</span>
  <span class="wave-animation">u</span>
  <span class="wave-animation">r</span>
  <span class="wave-animation">g</span>
  <span class="wave-animation">i</span>
  <span class="wave-animation">r</span>
</h2>
```

---

## ⏱️ Duração e Delay

### Delays Disponíveis
```css
.animate-delay-100  /* 0.1s */
.animate-delay-200  /* 0.2s */
.animate-delay-300  /* 0.3s */
.animate-delay-400  /* 0.4s */
.animate-delay-500  /* 0.5s */
.animate-delay-600  /* 0.6s */
.animate-delay-700  /* 0.7s */
.animate-delay-800  /* 0.8s */
```

### Duração Customizável
```css
.animate-duration-300  /* 0.3s */
.animate-duration-500  /* 0.5s */
.animate-duration-800  /* 0.8s (padrão) */
.animate-duration-1000 /* 1s */
.animate-duration-1200 /* 1.2s */
.animate-duration-1500 /* 1.5s */
```

---

## 🎯 Elementos Animados Automaticamente

O script `scroll-animations.js` **automaticamente** adiciona animações aos seguintes elementos:

- **Icon Boxes** (`.icon-box`) → `scroll-fade-in-up`
- **Portfolio Items** (`.portfolio-item`) → Alterna `scroll-slide-in-left` e `scroll-slide-in-right`
- **Process Steps** (`.process-step`) → `scroll-bounce-up`
- **Section Titles** (`.section-title`) → `scroll-zoom-in`
- **Pricing Cards** (`.pricing-card`) → `scroll-fade-in-up`
- **Team Members** (`.team-member`) → Alterna direções
- **Testimonials** (`.testimonial-item`) → `scroll-fade-in-up`
- **Feature Boxes** (`.feature-box`) → `scroll-fade-in-up`

**Tudo com delays em cascata!**

---

## 🚀 Otimizações de Performance

### 1. Respeita Preferências de Movimento
O CSS já inclui `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. Intersection Observer API
O script usa **Intersection Observer** para detectar elementos:
- ✅ Usa menos memória
- ✅ Executa quando necessário
- ✅ Desativa automaticamente após ativação

### 3. Práticas Recomendadas
```html
<!-- ❌ Evite animar muitos elementos simultaneamente -->
<div class="animate-fade-in animate-zoom-in animate-bounce-up">
  Muitas animações = lento
</div>

<!-- ✅ Use uma animação principal + efeito de hover -->
<div class="scroll-fade-in-up hover-lift">
  Melhor performance
</div>

<!-- ✅ Use delays para cascata -->
<div class="scroll-fade-in-up animate-delay-100">Item 1</div>
<div class="scroll-fade-in-up animate-delay-200">Item 2</div>
<div class="scroll-fade-in-up animate-delay-300">Item 3</div>
```

---

## 🎓 Dados Customizados (Data Attributes)

### Usar data-animate
```html
<div data-animate="fadeInUp">Conteúdo</div>
```

O script detectará e animará automaticamente!

### Usar data-parallax
```html
<div data-parallax="0.5">Conteúdo paralaxado</div>
```

---

## 📱 Mobile & Responsividade

As animações funcionam em todos os dispositivos:
- ✅ Desktop - Ativa ao rolar
- ✅ Tablet - Ativa ao rolar
- ✅ Mobile - Ativa ao rolar de forma otimizada

---

## 🔧 API JavaScript

Use a API exposta globalmente:

```javascript
// Animar elemento manualmente
ScrollAnimations.animate('.meu-elemento', 'scroll-fade-in-up');

// Observar elemento
ScrollAnimations.observe('.novo-elemento');

// Parar de observar
ScrollAnimations.unobserve('.elemento');

// Reinicializar todas as animações
ScrollAnimations.init();
```

---

## 🎬 Bibliotecas Compatíveis

Este sistema é compatível com:
- ✅ AOS (Animate On Scroll) - já usado no seu site
- ✅ Bootstrap - classes nativas
- ✅ Tailwind CSS - com modificações
- ✅ Foundation - sem conflitos

---

## 💬 Dúvidas?

Se precisar de animações customizadas:

1. **Adicione a keyframe** em `css/animations.css`
2. **Crie a classe** correspondente
3. **Use no seu HTML**

Exemplo:
```css
/* Em animations.css */
@keyframes myCustomAnimation {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-custom {
  animation: myCustomAnimation 0.8s ease-in-out forwards;
}
```

```html
<!-- Use no HTML -->
<div class="animate-custom">Meu elemento customizado</div>
```

---

**Aproveite as animações! 🎉**
