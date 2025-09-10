// Script para envio de mensagem via WhatsApp

const form = document.getElementById('contactForm');
const btnEnviar = document.getElementById('btnEnviar');
const feedback = document.getElementById('formFeedback');
const btnEnviarMensagem = document.querySelector('.btn-whatsapp');

btnEnviar.addEventListener('click', function(e) {
    e.preventDefault();

    const nome = form.nome.value;
    const email = form.email.value;
    const telefone = form.telefone.value;
    const mensagem = form.mensagem.value;

    const whatsappMessage = `Assunto: Contato\nNome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nMensagem: ${mensagem}`;

    const whatsappUrl = `https://wa.me/5581989035561?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank');

    feedback.textContent = 'Mensagem preparada para WhatsApp!';
    feedback.style.color = 'green';
    form.reset();
});

btnEnviarMensagem.addEventListener('click', function(e) {
    e.preventDefault();

    const mensagem = form.mensagem.value;

    const whatsappUrl = `https://wa.me/5581989035561?text=${encodeURIComponent(mensagem)}`;

    window.open(whatsappUrl, '_blank');

    feedback.textContent = 'Mensagem preparada para WhatsApp!';
    feedback.style.color = 'green';
});
