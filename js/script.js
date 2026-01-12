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

// Tic-Tac-Toe Game Logic
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');
const cells = document.querySelectorAll('[data-cell]');

const PLAYER_X = 'X';
const PLAYER_O = 'O'; // Bot
let isGameActive = true;
let currentPlayer = PLAYER_X;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const handlePlayerMove = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    // Allow move only if it's player's turn, cell is empty, and game is active
    if (currentPlayer !== PLAYER_X || gameState[clickedCellIndex] !== "" || !isGameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);

    if (isGameActive) {
        currentPlayer = PLAYER_O;
        gameStatus.textContent = "Bot está pensando...";
        // Disable board during bot's turn
        gameBoard.style.pointerEvents = 'none'; 
        setTimeout(botMove, 1000); // Bot plays after 1 second
    }
};

const updateCell = (cell, index) => {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkResult();
};

const checkResult = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = currentPlayer === PLAYER_X ? "Você venceu!" : "O Bot venceu!";
        isGameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        gameStatus.textContent = "Empate!";
        isGameActive = false;
        return;
    }
};

const botMove = () => {
    if (!isGameActive) return;

    let move = -1;

    // 1. Check for a winning move for the bot
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] === PLAYER_O && gameState[b] === PLAYER_O && gameState[c] === "") move = c;
        else if (gameState[a] === PLAYER_O && gameState[c] === PLAYER_O && gameState[b] === "") move = b;
        else if (gameState[b] === PLAYER_O && gameState[c] === PLAYER_O && gameState[a] === "") move = a;
        if (move !== -1) break;
    }

    // 2. Check to block the player's winning move
    if (move === -1) {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] === PLAYER_X && gameState[b] === PLAYER_X && gameState[c] === "") move = c;
            else if (gameState[a] === PLAYER_X && gameState[c] === PLAYER_X && gameState[b] === "") move = b;
            else if (gameState[b] === PLAYER_X && gameState[c] === PLAYER_X && gameState[a] === "") move = a;
            if (move !== -1) break;
        }
    }

    // 3. If no strategic move, pick a random available cell
    if (move === -1) {
        const emptyCells = gameState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            move = emptyCells[randomIndex];
        }
    }

    if (move !== -1) {
        const cellToUpdate = cells[move];
        updateCell(cellToUpdate, move);
    }

    if (isGameActive) {
        currentPlayer = PLAYER_X;
        gameStatus.textContent = "Sua vez";
        gameBoard.style.pointerEvents = 'auto'; // Re-enable board
    }
};

const restartGame = () => {
    isGameActive = true;
    currentPlayer = PLAYER_X;
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameStatus.textContent = "Sua vez";
    cells.forEach(cell => cell.textContent = "");
    gameBoard.style.pointerEvents = 'auto';
};

cells.forEach(cell => cell.addEventListener('click', handlePlayerMove));
restartButton.addEventListener('click', restartGame);

// Easter Egg: Konami Code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keyup', (e) => {
    // Use e.key for modern browsers
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0; // Reset for next time
            activatePartyMode();
        }
    } else {
        // Reset if the wrong key is pressed
        konamiIndex = 0;
    }
});

function activatePartyMode() {
    const partyFeedback = document.createElement('div');
    partyFeedback.textContent = '🎉 Konami Code Ativado! 🎉';
    partyFeedback.className = 'konami-feedback';
    document.body.appendChild(partyFeedback);
    document.body.classList.add('party-mode');
    
    setTimeout(() => {
        document.body.classList.remove('party-mode');
        document.body.removeChild(partyFeedback);
    }, 4000); // Party mode lasts for 4 seconds
}
