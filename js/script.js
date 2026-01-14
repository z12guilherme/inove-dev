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

        // --- SEGURANÇA: Rate Limiting (Anti-Spam) ---
        const lastSent = localStorage.getItem('lastEmailSent');
        const cooldown = 60000; // Tempo de espera em milissegundos (60 segundos)
        const now = Date.now();

        if (lastSent && (now - lastSent < cooldown)) {
            const remaining = Math.ceil((cooldown - (now - lastSent)) / 1000);
            feedback.textContent = `🛡️ Segurança: Aguarde ${remaining} segundos para enviar outra mensagem.`;
            feedback.style.color = 'orange';
            return;
        }

        const nome = form.from_name.value.trim();
        const email = form.reply_to.value.trim();
        const telefone = form.phone_number.value.trim();
        const mensagem = form.message.value.trim();

        // Validação de campos obrigatórios
        if (!nome || !email || !mensagem) {
            feedback.textContent = '⚠️ Por favor, preencha Nome, Email e Mensagem.';
            feedback.style.color = 'red';
            return;
        }

        // Feedback visual
        feedback.textContent = '⏳ Enviando mensagem...';
        feedback.style.color = 'blue';
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';

        // Envio via EmailJS
        // Substitua 'service_id' e 'template_id' pelos seus IDs do EmailJS
        emailjs.sendForm('service_avp4pa9', 'guii', this.closest('form'))
            .then(() => {
                feedback.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
                feedback.style.color = 'green';
                form.reset();
                
                // Registra o momento do envio para bloquear novas tentativas imediatas
                localStorage.setItem('lastEmailSent', Date.now());
            }, (err) => {
                console.error('Erro EmailJS:', err);
                feedback.textContent = '❌ Erro ao enviar e-mail. Redirecionando para WhatsApp...';
                feedback.style.color = 'orange';
                
                // Fallback: Se o e-mail falhar, manda pro WhatsApp
                setTimeout(() => {
                    const whatsappMessage = `📌 Assunto: Contato (Fallback)\n👤 Nome: ${nome}\n✉️ Email: ${email}\n📞 Telefone: ${telefone || "Não informado"}\n💬 Mensagem: ${mensagem}`;
                    enviarMensagemWhatsApp(whatsappMessage);
                }, 1500);
            })
            .finally(() => {
                btnEnviar.disabled = false;
                btnEnviar.textContent = 'Enviar Mensagem';
                
                // Limpa feedback após 5s
                setTimeout(() => { feedback.textContent = ''; }, 5000);
            });
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
            secretIndex = 0; // Reset for next time
            startMatrixEffect();
        }
    } else {
        secretIndex = 0;
        // Se errou mas digitou a primeira letra, já conta como início
        if (key === secretCode[0]) secretIndex = 1;
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
    const audio = new Audio('../assets/SecretFile.wav');
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
    msg.innerHTML = 'VOCÊ ACHOU QUE TINHA ACABADO?<br><br><span style="font-size: 1.5rem; color: #fff;">O VERDADEIRO DESAFIO COMEÇA AGORA.</span><br><br><span style="font-size: 1.2rem; color: #00C7B7; text-shadow: none; font-family: monospace; display: block; margin-top: 15px;">Volte ao terminal e execute:<br><span style="color: #ff0000; font-weight: bold; font-size: 1.5rem;">protocol_ghost</span></span>';
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
                try {
                    Tawk_API.setAttributes({
                        name: nome,
                        email: email
                    }, function(error){});
                } catch (e) {
                    console.warn("Tawk.to update error:", e);
                }
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

// Elementos do Nível 2 (Esteganografia)
const level2Container = document.getElementById('level-2-container');
const stegoInput = document.getElementById('stego-input');
const stegoSubmit = document.getElementById('stego-submit');
const stegoFeedback = document.getElementById('stego-feedback');

// Desafio fixo: Pentest (Hash MD5: 46ea1712d4b13b55b3f680cc5b8b54e8)
const currentChallenge = { word: 'pentest', hash: '46ea1712d4b13b55b3f680cc5b8b54e8' };
// Desafio Nível 2: Decodificação de Código Morse
const stegoChallenge = { word: 'as imagens guardam segredos' };
// Desafio Nível 3 (HARD): Protocol Ghost
const ghostTrigger = 'protocol_ghost';
const ghostSolution = 'a ordem vem do caos';
const ghostHash = "$2b$10$M.E.D.R.O.O.S.A.C.O.D.M.E.V.A";

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
        
        // --- TRIGGER HARD MODE ---
        if (attempt === ghostTrigger) {
            initGhostMode();
            return;
        }

        if (attempt === currentChallenge.word) {
            ctfFeedback.innerHTML = '> HASH DECRIPTADO COM SUCESSO.<br>> <span class="cursor">O BARULHO NÃO FOI VOCÊ...</span>';
            ctfFeedback.style.color = '#00ff00';
            
            // Desabilita o input do nível 1
            ctfInput.disabled = true;
            ctfSubmit.disabled = true;

            // Revela o nível 2 após um breve delay para efeito dramático
            setTimeout(() => {
                level2Container.style.display = 'block';
                
                // Toca o áudio oculto (usuário deve achar no Network)
                const audio = new Audio('../assets/SecretFile.wav');
                audio.play().catch(e => console.warn("Interação necessária para áudio"));
                
                stegoInput.focus();
            }, 1000);

        } else {
            ctfFeedback.textContent = '> ACESSO NEGADO. SENHA INCORRETA.';
            ctfFeedback.style.color = 'red';
        }
    });
    
    // Lógica do Nível 2
    if (stegoSubmit) {
        stegoSubmit.addEventListener('click', () => {
            const attempt = stegoInput.value.toLowerCase().trim();
            if (attempt === stegoChallenge.word) {
                stegoFeedback.innerHTML = '> MENSAGEM CONFIRMADA.<br>> DICA: <span style="color:#fff">A mensagem está bem clara.</span>';
                stegoFeedback.style.color = '#00ff00';
                
                // Trava o input pois o usuário passou desta fase
                stegoInput.disabled = true;
                stegoSubmit.disabled = true;
                
            } else {
                stegoFeedback.textContent = '> CHAVE DECRIPTOGRAFIA INVÁLIDA.';
                stegoFeedback.style.color = 'red';
            }
        });

        stegoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') stegoSubmit.click();
        });
    }

    // Permite apertar Enter no input
    ctfInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') ctfSubmit.click();
    });

    // Inicia o desafio
    initCTF();
}

// --- PROTOCOL GHOST: LOGIC ---
function initGhostMode() {
    // 1. Criar Overlay
    const overlay = document.createElement('div');
    overlay.className = 'ghost-overlay';
    
    // 2. Estrutura do Hash (Letra por letra para animação)
    // $2b$10$M.E.D.R.O.O.S.A.C.O.D.M.E.V.A
    // Vamos marcar o que é ruído e o que é letra
    const hashHTML = `
        <span class="ghost-char noise">$</span>
        <span class="ghost-char noise">2</span>
        <span class="ghost-char noise">b</span>
        <span class="ghost-char noise">$</span>
        <span class="ghost-char noise">1</span>
        <span class="ghost-char noise">0</span>
        <span class="ghost-char noise">$</span>
        <span class="ghost-char" data-char="M">M</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="E">E</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="D">D</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="R">R</span><span class="ghost-char noise">.</span>
        <span class="ghost-char" data-char="O">O</span><span class="ghost-char noise">.</span>
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
            <div class="ghost-frame">
                <a href="assets/monalisa.jpg" download><img src="assets/monalisa.jpg" alt="Mona Lisa"></a>
                <div class="ghost-label">Mona Lisa</div>
            </div>
            <div class="ghost-frame">
                <a href="assets/adam.jpg" download><img src="assets/adam.jpg" alt="A Criação de Adão"></a>
                <div class="ghost-label">A Criação de Adão</div>
            </div>
            <div class="ghost-frame">
                <a href="assets/athens.jpg" download><img src="assets/athens.jpg" alt="Escola de Atenas"></a>
                <div class="ghost-label">Escola de Atenas</div>
            </div>
        </div>

        <input type="text" class="ghost-input" placeholder="Qual é a sua escolha?" autocomplete="off">
        <div class="ghost-final-message">VOCÊ NÃO ESCAPOU DA PRISÃO.<br><br><span style="font-size:1.5rem">VOCÊ PERCEBEU QUE ELA NUNCA EXISTIU.</span></div>
    `;

    document.body.appendChild(overlay);

    // Áudio Loop (Morse)
    const audio = new Audio('assets/hard_mode_morse.wav');
    audio.loop = true;
    audio.volume = 0.3;
    
    // Fade In
    setTimeout(() => {
        overlay.classList.add('active');
        audio.play().catch(e => console.log("Clique para tocar áudio"));
    }, 100);

    // Lógica de Validação
    const input = overlay.querySelector('.ghost-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (input.value.toLowerCase().trim() === ghostSolution) {
                // VITÓRIA
                input.style.display = 'none';
                document.querySelector('.ghost-gallery').style.display = 'none';
                
                // 1. Fade out noise
                document.querySelectorAll('.ghost-char.noise').forEach(el => {
                    el.classList.add('fade-out');
                });

                // 2. Animação de rearranjo (Simulada via Cross-fade para simplicidade e elegância)
                setTimeout(() => {
                    const hashContainer = document.getElementById('ghostHash');
                    hashContainer.style.transition = 'opacity 1s';
                    hashContainer.style.opacity = '0';
                    
                    setTimeout(() => {
                        hashContainer.innerHTML = 'A ORDEM VEM DO CAOS';
                        hashContainer.style.fontFamily = 'Times New Roman, serif';
                        hashContainer.style.opacity = '1';
                        
                        // 3. Mensagem Final
                        setTimeout(() => {
                            document.querySelector('.ghost-final-message').style.opacity = '1';
                        }, 2000);
                    }, 1000);
                }, 1500);
            } else {
                // Erro visual
                input.style.borderBottomColor = 'red';
                setTimeout(() => input.style.borderBottomColor = '#333', 500);
            }
        }
    });
}
