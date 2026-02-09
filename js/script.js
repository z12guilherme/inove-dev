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
    if(feedback) {
        feedback.textContent = '✅ Mensagem preparada para WhatsApp!';
        feedback.style.color = 'green';
        setTimeout(() => { feedback.textContent = ''; }, 5000);
    }
}

// Função para enviar notificação silenciosa ao Telegram
async function notificarTelegram(dados) {
    try {
        await fetch('/.netlify/functions/telegram-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        console.log("Notificação Telegram enviada.");
    } catch (e) {
        console.warn("Falha ao notificar Telegram:", e);
    }
}

// Clique no botão principal "Enviar Mensagem"
if (btnEnviar) {
    btnEnviar.addEventListener('click', function (e) {
        e.preventDefault();

        const lastSent = localStorage.getItem('lastEmailSent');
        const cooldown = 60000;
        const now = Date.now();

        if (lastSent && (now - lastSent < cooldown)) {
            const remaining = Math.ceil((cooldown - (now - lastSent)) / 1000);
            feedback.textContent = `🛡️ Segurança: Aguarde ${remaining} segundos.`;
            feedback.style.color = 'orange';
            return;
        }

        const nome = form.from_name.value.trim();
        const email = form.reply_to.value.trim();
        const telefone = form.phone_number.value.trim();
        const mensagem = form.message.value.trim();

        if (!nome || !email || !mensagem) {
            feedback.textContent = '⚠️ Por favor, preencha Nome, Email e Mensagem.';
            feedback.style.color = 'red';
            return;
        }

        feedback.textContent = '⏳ Enviando mensagem...';
        feedback.style.color = 'blue';
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        notificarTelegram({ nome, email, telefone, mensagem });

        emailjs.sendForm('service_avp4pa9', 'guii', this.closest('form'))
            .then(() => {
                feedback.textContent = '✅ Mensagem enviada com sucesso!';
                feedback.style.color = 'green';
                form.reset();
                localStorage.setItem('lastEmailSent', Date.now());
            }, (err) => {
                console.error('Erro EmailJS:', err);
                feedback.textContent = '❌ Erro no e-mail. Redirecionando para WhatsApp...';
                feedback.style.color = 'orange';
                
                setTimeout(() => {
                    const whatsappMessage = `📌 Assunto: Contato (Fallback)\n👤 Nome: ${nome}\n✉️ Email: ${email}\n📞 Telefone: ${telefone || "Não informado"}\n💬 Mensagem: ${mensagem}`;
                    enviarMensagemWhatsApp(whatsappMessage);
                }, 1500);
            })
            .finally(() => {
                btnEnviar.disabled = false;
                btnEnviar.textContent = 'Enviar Mensagem';
                setTimeout(() => { if(feedback) feedback.textContent = ''; }, 5000);
            });
    });
}

if (btnEnviarMensagem) {
    btnEnviarMensagem.addEventListener('click', function (e) {
        e.preventDefault();
        const mensagemField = form.querySelector('[name="message"]');
        const mensagem = mensagemField ? mensagemField.value.trim() : "Olá! Gostaria de mais informações.";
        enviarMensagemWhatsApp(mensagem || "Olá! Gostaria de mais informações.");
    });
}

// Mobile Navigation Toggle
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navbar = document.querySelector('#navbar');

if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', function(e) {
        navbar.classList.toggle('navbar-mobile');
        this.classList.toggle('bi-list');
        this.classList.toggle('bi-x');
    });
}

// --- SCROLL ANIMATIONS & PROGRESS BAR LOGIC ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            if (window.Tawk_API && typeof Tawk_API.addEvent === 'function') {
                const sectionName = entry.target.getAttribute('id') || 'geral';
                Tawk_API.addEvent('vendo_secao', { secao: sectionName }, function(error){});
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Back to top button & Scroll Progress Logic
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Listener de Scroll Unificado (Performance)
window.addEventListener('scroll', () => {
    // 1. Back to Top Visibility
    if (window.pageYOffset > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }

    // 2. Barra de Progresso no Menu
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }
});

// Set current year
const yearSpan = document.getElementById('currentYear');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Initialize Swiper
if (document.querySelector('.testimonials-slider')) {
    const slideCount = document.querySelectorAll('.testimonials-slider .swiper-slide').length;
    const enableLoop = slideCount > 2;
    new Swiper('.testimonials-slider', {
        speed: 600,
        loop: enableLoop,
        autoplay: { delay: 5000, disableOnInteraction: false },
        slidesPerView: 'auto',
        pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 20 },
            1200: { slidesPerView: 2, spaceBetween: 20 }
        }
    });
}

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
    if (!memoryGame) return;
    memoryGame.innerHTML = '';
    moves = 0;
    matches = 0;
    if(movesDisplay) movesDisplay.textContent = moves;
    
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
    if(movesDisplay) movesDisplay.textContent = moves;
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

if (restartButton) restartButton.addEventListener('click', initGame);
if (memoryGame) initGame();

// Easter Egg: Secret Code (Hollywood)
const secretCode = 'hollywood';
let secretIndex = 0;

document.addEventListener('keydown', (e) => {
    if (!e.key) return;
    const key = e.key.toLowerCase();
    const expected = secretCode[secretIndex];

    if (key === expected) {
        secretIndex++;
        if (secretIndex === secretCode.length) {
            secretIndex = 0;
            startMatrixEffect();
        }
    } else {
        secretIndex = 0;
        if (key === secretCode[0]) secretIndex = 1;
    }
});

function startMatrixEffect() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;pointer-events:none;background:black;';
    document.body.appendChild(canvas);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = '0101010101010101';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.ceil(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    const interval = setInterval(draw, 33);
    const audio = new Audio('../assets/SecretFile.wav');
    audio.play().catch(e => console.log("Áudio bloqueado"));

    const msg = document.createElement('div');
    msg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#0F0;font-family:Courier New;font-size:2rem;font-weight:bold;text-align:center;z-index:9999;text-shadow:0 0 10px #0F0;background:rgba(0,0,0,0.8);padding:20px;border:2px solid #0F0;';
    msg.innerHTML = 'VOCÊ ACHOU QUE TINHA ACABADO?<br><br><span style="font-size:1.5rem;color:#fff;">O VERDADEIRO DESAFIO COMEÇA AGORA.</span><br><br><span style="font-size:1.2rem;color:#00C7B7;font-family:monospace;display:block;margin-top:15px;">Volte ao terminal e execute:<br><span style="color:#f00;font-weight:bold;font-size:1.5rem;">protocol_ghost</span></span>';
    document.body.appendChild(msg);

    setTimeout(() => {
        clearInterval(interval);
        document.body.removeChild(canvas);
        document.body.removeChild(msg);
        audio.pause();
    }, 15000);
}

// Integração Tawk.to
if (form) {
    const nomeInput = form.querySelector('input[name="nome"]');
    const emailInput = form.querySelector('input[name="email"]');
    const updateTawkUser = function() {
        if (window.Tawk_API && typeof Tawk_API.setAttributes === 'function' && nomeInput && emailInput) {
            Tawk_API.setAttributes({ name: nomeInput.value.trim(), email: emailInput.value.trim() }, function(error){});
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
const level2Container = document.getElementById('level-2-container');
const stegoInput = document.getElementById('stego-input');
const stegoSubmit = document.getElementById('stego-submit');
const stegoFeedback = document.getElementById('stego-feedback');

const currentChallenge = { word: 'pentest', hash: '46ea1712d4b13b55b3f680cc5b8b54e8' };
const stegoChallenge = { word: 'as imagens guardam segredos' };
const ghostTrigger = 'protocol_ghost';
const ghostSolution = 'a ordem vem do caos';

function initCTF() {
    if (!ctfHashDisplay) return;
    ctfHashDisplay.textContent = "VERIFIQUE O CONSOLE (F12)";
    console.log("%cParabéns DEV, o que você conseguiu foi apenas isso: 46ea1712d4b13b55b3f680cc5b8b54e8", "color: #00C7B7; font-size: 16px; font-weight: bold; background: #0D1B2A; padding: 10px; border-radius: 5px;");
    ctfInput.value = '';
    if(ctfFeedback) ctfFeedback.textContent = '';
}

if (ctfSubmit) {
    ctfSubmit.addEventListener('click', () => {
        const attempt = ctfInput.value.toLowerCase().trim();
        if (attempt === ghostTrigger) {
            initGhostMode();
            return;
        }
        if (attempt === currentChallenge.word) {
            ctfFeedback.innerHTML = '> HASH DECRIPTADO COM SUCESSO.<br>> <span class="cursor">O BARULHO NÃO FOI VOCÊ...</span>';
            ctfFeedback.style.color = '#00ff00';
            ctfInput.disabled = true;
            ctfSubmit.disabled = true;
            setTimeout(() => {
                if(level2Container) level2Container.style.display = 'block';
                const audio = new Audio('../assets/SecretFile.wav');
                audio.play().catch(e => console.warn("Interação necessária para áudio"));
                if(stegoInput) stegoInput.focus();
            }, 1000);
        } else {
            ctfFeedback.textContent = '> ACESSO NEGADO. SENHA INCORRETA.';
            ctfFeedback.style.color = 'red';
        }
    });

    if (stegoSubmit) {
        stegoSubmit.addEventListener('click', () => {
            const attempt = stegoInput.value.toLowerCase().trim();
            if (attempt === stegoChallenge.word) {
                stegoFeedback.innerHTML = '> MENSAGEM CONFIRMADA.<br>> DICA: <span style="color:#fff">A mensagem está bem clara.</span>';
                stegoFeedback.style.color = '#00ff00';
                stegoInput.disabled = true;
                stegoSubmit.disabled = true;
            } else {
                stegoFeedback.textContent = '> CHAVE DECRIPTOGRAFIA INVÁLIDA.';
                stegoFeedback.style.color = 'red';
            }
        });
        stegoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') stegoSubmit.click(); });
    }
    ctfInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') ctfSubmit.click(); });
    initCTF();
}

// --- PROTOCOL GHOST: LOGIC ---
function initGhostMode() {
    const overlay = document.createElement('div');
    overlay.className = 'ghost-overlay';
    
    // Simplificado para economizar espaço
    const hashHTML = `
        <span class="ghost-char noise">$</span><span class="ghost-char noise">2</span><span class="ghost-char noise">b</span>
        <span class="ghost-char" data-char="M">M</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="E">E</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="D">D</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="O">O</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="S">S</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="A">A</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="C">C</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="O">O</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="D">D</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="M">M</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="E">E</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="V">V</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="A">A</span>
    `;

    overlay.innerHTML = `
        <div class="ghost-title">A ARTE PODE SER PRISÃO OU LIBERDADE</div>
        <div class="ghost-hash-container" id="ghostHash">${hashHTML}</div>
        <div class="ghost-gallery">
            <div class="ghost-frame"><img src="assets/monalisa.jpg" alt="Mona Lisa"><div class="ghost-label">Mona Lisa</div></div>
            <div class="ghost-frame"><img src="assets/adam.jpg" alt="A Criação de Adão"><div class="ghost-label">A Criação de Adão</div></div>
            <div class="ghost-frame"><img src="assets/athens.jpg" alt="Escola de Atenas"><div class="ghost-label">Escola de Atenas</div></div>
        </div>
        <input type="text" class="ghost-input" placeholder="Qual é a sua escolha?" autocomplete="off">
        <div class="ghost-final-message">VOCÊ NÃO ESCAPOU DA PRISÃO.<br><br><span style="font-size:1.5rem">VOCÊ PERCEBEU QUE ELA NUNCA EXISTIU.</span></div>
    `;

    document.body.appendChild(overlay);
    console.log("%c🔊 Você está tentando se libertar pelos seus sentidos...", "color: #ff0000; background: #000; padding: 10px;");
    console.log("%c🎼 Som sem direção não é sinfonia...", "color: #00C7B7; background: #000; padding: 10px;");

    const audio = new Audio('assets/hard_mode_morse.wav');
    audio.loop = true;
    audio.volume = 0.3;
    
    setTimeout(() => {
        overlay.classList.add('active');
        audio.play().catch(e => console.log("Clique para tocar áudio"));
    }, 100);

    const input = overlay.querySelector('.ghost-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (input.value.toLowerCase().trim() === ghostSolution) {
                input.style.display = 'none';
                document.querySelector('.ghost-gallery').style.display = 'none';
                document.querySelectorAll('.ghost-char.noise').forEach(el => el.classList.add('fade-out'));
                setTimeout(() => {
                    const hashContainer = document.getElementById('ghostHash');
                    hashContainer.style.transition = 'opacity 1s';
                    hashContainer.style.opacity = '0';
                    setTimeout(() => {
                        hashContainer.innerHTML = 'A ORDEM VEM DO CAOS';
                        hashContainer.style.fontFamily = 'Times New Roman, serif';
                        hashContainer.style.opacity = '1';
                        setTimeout(() => {
                            document.querySelector('.ghost-final-message').style.opacity = '1';
                        }, 2000);
                    }, 1000);
                }, 1500);
            } else {
                input.style.borderBottomColor = 'red';
                setTimeout(() => input.style.borderBottomColor = '#333', 500);
            }
        }
    });
}