// Script para envio de mensagem via WhatsApp

const form = document.getElementById('contactForm');
const btnEnviar = document.getElementById('btnEnviar');
const feedback = document.getElementById('formFeedback');
const btnEnviarMensagem = document.querySelector('.btn-whatsapp');

function enviarMensagemWhatsApp(mensagem) {
    const whatsappUrl = `https://wa.me/5581989035561?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    feedback.textContent = '✅ Mensagem preparada para WhatsApp!';
    feedback.style.color = 'green';
    // Clear feedback after 5 seconds
    setTimeout(() => {
        feedback.textContent = '';
    }, 5000);
}

// Clique no botão principal "Enviar Mensagem"
if (btnEnviar) {
    btnEnviar.addEventListener('click', function (e) {
        e.preventDefault();

        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const telefone = form.telefone.value.trim();
        const mensagem = form.mensagem.value.trim();

        // Validação de campos obrigatórios
        if (!nome || !email || !mensagem) {
            feedback.textContent = '⚠️ Por favor, preencha Nome, Email e Mensagem.';
            feedback.style.color = 'red';
            return;
        }

        const whatsappMessage = `📌 Assunto: Contato
👤 Nome: ${nome}
✉️ Email: ${email}
📞 Telefone: ${telefone || "Não informado"}
💬 Mensagem: ${mensagem}`;

        enviarMensagemWhatsApp(whatsappMessage);
        form.reset();
    });
}

// Clique no botão alternativo com classe .btn-whatsapp
if (btnEnviarMensagem) {
    btnEnviarMensagem.addEventListener('click', function (e) {
        e.preventDefault();

        const mensagem = form.mensagem.value.trim() || "Olá! Gostaria de mais informações.";
        enviarMensagemWhatsApp(mensagem);
    });
}

// Light beam following mouse in hero section
const hero = document.querySelector('.hero');
const lightBeam = document.querySelector('.light-beam');

if (hero && lightBeam) {
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left - 150; // Center the beam (half of 300px)
        const y = e.clientY - rect.top - 150;
        lightBeam.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Scroll animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top'; // Class already has styles in styles.css
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

// Set current year in footer
const yearSpan = document.getElementById('currentYear');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
