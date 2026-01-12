// Easter Egg: Console Log Message for developers
console.log(
    "%cE aí, dev! 👋 Curioso para ver como as coisas funcionam por aqui?",
    "color: #00C7B7; font-size: 20px; font-weight: bold;"
);
console.log(
    "%cNosso código é feito com a mesma paixão que colocamos em nossos projetos. Dê uma olhada! 😉",
    "font-size: 16px;"
);

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

// Scroll animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Tawk.to: Informar à IA em qual seção o usuário está (Contexto para o Base Prompt)
            if (window.Tawk_API && typeof Tawk_API.addEvent === 'function') {
                const sectionName = entry.target.getAttribute('id') || 'geral';
                Tawk_API.addEvent('vendo_secao', { secao: sectionName }, function(error){});
            }
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

// Memory Game Logic
const memoryGame = document.getElementById('memoryGame');
const restartButton = document.getElementById('restartButton');
const movesDisplay = document.getElementById('moves');

const cardsData = [
    { name: 'html', icon: 'fa-brands fa-html5' },
    { name: 'css', icon: 'fa-brands fa-css3-alt' },
    { name: 'js', icon: 'fa-brands fa-js' },
    { name: 'nodejs', icon: 'fa-brands fa-node-js' },
    { name: 'supabase', icon: 'fa-solid fa-database' },
    { name: 'react', icon: 'fa-brands fa-react' },
    { name: 'vite', icon: 'fa-solid fa-bolt' }
];

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matches = 0;

function initGame() {
    memoryGame.innerHTML = '';
    moves = 0;
    matches = 0;
    movesDisplay.textContent = moves;
    
    // Duplicate array to create pairs and shuffle
    cards = [...cardsData, ...cardsData];
    cards.sort(() => 0.5 - Math.random());

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.framework = card.name;
        
        cardElement.innerHTML = `
            <div class="front-face"><i class="${card.icon}"></i></div>
            <div class="back-face"><i class="bi bi-question-lg"></i></div>
        `;
        
        cardElement.addEventListener('click', flipCard);
        memoryGame.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matches++;
    if(matches === cardsData.length) {
        setTimeout(() => alert(`Parabéns! Você completou em ${moves} movimentos.`), 500);
    }
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

if (restartButton) {
    restartButton.addEventListener('click', initGame);
}

// Initialize game on load
if (memoryGame) {
    initGame();
}

// Easter Egg: Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    // Normaliza para minúsculo para funcionar com Caps Lock ou Shift
    const key = e.key.toLowerCase();
    const expected = konamiCode[konamiIndex].toLowerCase();

    if (key === expected) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0; // Reset for next time
            startMatrixEffect();
        }
    } else {
        konamiIndex = 0;
        // Se errou mas digitou a primeira tecla (ArrowUp), já conta como início
        if (key === 'arrowup') konamiIndex = 1;
    }
});

function startMatrixEffect() {
    // Cria o canvas para o efeito Matrix
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9998';
    canvas.style.pointerEvents = 'none';
    canvas.style.background = 'black';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = '0101010101010101';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let i = 0; i < columns; i++) drops[i] = 1;

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975)
                drops[i] = 0;
            
            drops[i]++;
        }
    }

    const interval = setInterval(draw, 33);

    // Áudio Secreto (Código Morse)
    const audio = new Audio('assets/audio_morse.wav');
    audio.play().catch(e => console.log("Áudio bloqueado pelo navegador (necessário interação):", e));

    // Mensagem Final
    const msg = document.createElement('div');
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.color = '#0F0';
    msg.style.fontFamily = 'Courier New, monospace';
    msg.style.fontSize = '2rem';
    msg.style.fontWeight = 'bold';
    msg.style.textAlign = 'center';
    msg.style.zIndex = '9999';
    msg.style.textShadow = '0 0 10px #00ff00';
    msg.style.background = 'rgba(0,0,0,0.8)';
    msg.style.padding = '20px';
    msg.style.border = '2px solid #0F0';
    msg.innerHTML = 'CONGRATULATIONS,<br>YOU ARE END OF THE SECURITY GAME<br><br><span style="font-size: 1.2rem; color: #00C7B7; text-shadow: none; font-family: monospace; display: block; margin-top: 15px;">[!] Dica: O áudio não é por acaso HAHAHA</span>';
    document.body.appendChild(msg);

    // Remove o efeito após 15 segundos
    setTimeout(() => {
        clearInterval(interval);
        document.body.removeChild(canvas);
        document.body.removeChild(msg);
        audio.pause();
        audio.currentTime = 0;
    }, 15000);
}

// Integração Tawk.to com Formulário de Contato
// Se o usuário preencher o formulário, atualizamos o nome no chat automaticamente
if (form) {
    const nomeInput = form.querySelector('input[name="nome"]');
    const emailInput = form.querySelector('input[name="email"]');

    const updateTawkUser = function() {
        if (window.Tawk_API && typeof Tawk_API.setAttributes === 'function') {
            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            
            if (nome || email) {
                Tawk_API.setAttributes({
                    name: nome,
                    email: email
                }, function(error){});
            }
        }
    };

    if (nomeInput && emailInput) {
        nomeInput.addEventListener('blur', updateTawkUser);
        emailInput.addEventListener('blur', updateTawkUser);
    }
}

// CTF Challenge Logic
const ctfHashDisplay = document.getElementById('ctf-hash');
const ctfInput = document.getElementById('ctf-input');
const ctfSubmit = document.getElementById('ctf-submit');
const ctfFeedback = document.getElementById('ctf-feedback');

// Desafio fixo: Pentest (Hash MD5: 46ea1712d4b13b55b3f680cc5b8b54e8)
const currentChallenge = { word: 'pentest', hash: '46ea1712d4b13b55b3f680cc5b8b54e8' };

function initCTF() {
    if (!ctfHashDisplay) return;
    
    // Exibe dica na tela
    ctfHashDisplay.textContent = "VERIFIQUE O CONSOLE (F12)";
    
    // Exibe o hash no console como Easter Egg
    console.log(
        "%cParabéns DEV, o que você conseguiu foi apenas isso: 46ea1712d4b13b55b3f680cc5b8b54e8",
        "color: #00C7B7; font-size: 16px; font-weight: bold; background: #0D1B2A; padding: 10px; border-radius: 5px;"
    );

    ctfInput.value = '';
    ctfFeedback.textContent = '';
    ctfFeedback.style.color = '';
}

if (ctfSubmit) {
    ctfSubmit.addEventListener('click', () => {
        const attempt = ctfInput.value.toLowerCase().trim();
        if (attempt === currentChallenge.word) {
            ctfFeedback.innerHTML = '> ACESSO CONCEDIDO!<br>> CÓDIGO SECRETO: ↑ ↑ ↓ ↓ ← → ← → B A';
            ctfFeedback.style.color = '#00ff00';
        } else {
            ctfFeedback.textContent = '> ACESSO NEGADO. SENHA INCORRETA.';
            ctfFeedback.style.color = 'red';
        }
    });
    
    // Permite apertar Enter no input
    ctfInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') ctfSubmit.click();
    });

    // Inicia o desafio
    initCTF();
}
