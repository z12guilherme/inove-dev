document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shortenerForm');
    const input = document.getElementById('longUrl');
    const btnShorten = document.getElementById('btnShorten');
    const resultArea = document.getElementById('resultArea');
    const loadingArea = document.getElementById('loadingArea');
    const shortUrlInput = document.getElementById('shortUrl');
    const btnCopy = document.getElementById('btnCopy');
    const btnNew = document.getElementById('btnNew');
    const qrCodeContainer = document.getElementById('qrCodeContainer');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = input.value.trim();

        if (!url) return;

        // UI States
        btnShorten.disabled = true;
        loadingArea.style.display = 'block';
        resultArea.style.display = 'none';

        try {
            // Chama a Netlify Function
            const response = await fetch('/.netlify/functions/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            if (response.ok && data.result) {
                // Sucesso
                shortUrlInput.value = data.result;
                
                // Gera QR Code usando API pública
                qrCodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.result)}" class="qr-code-img" alt="QR Code">`;
                
                loadingArea.style.display = 'none';
                resultArea.style.display = 'block';
            } else {
                throw new Error(data.error || 'Erro desconhecido');
            }
        } catch (error) {
            console.error(error);
            alert('Ops! Não foi possível encurtar este link. Verifique a URL e tente novamente.');
            loadingArea.style.display = 'none';
            btnShorten.disabled = false;
        }
    });

    // Copiar para área de transferência
    btnCopy.addEventListener('click', () => {
        shortUrlInput.select();
        document.execCommand('copy'); // Fallback para navegadores antigos
        navigator.clipboard.writeText(shortUrlInput.value); // API moderna
        
        const originalText = btnCopy.innerHTML;
        btnCopy.innerHTML = '<i class="bi bi-check"></i> Copiado!';
        setTimeout(() => btnCopy.innerHTML = originalText, 2000);
    });

    // Resetar
    btnNew.addEventListener('click', () => {
        input.value = '';
        resultArea.style.display = 'none';
        btnShorten.disabled = false;
        input.focus();
    });
});