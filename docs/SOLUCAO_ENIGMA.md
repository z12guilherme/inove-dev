# 🕵️‍♂️ Gabarito: Protocolo Ghost

Este arquivo contém a solução passo a passo para o desafio CTF (Capture The Flag) escondido no site.

**⚠️ SPOILER ALERT: Não leia se quiser tentar resolver sozinho!**

---

## 📍 Passo 1: O Acesso
1. Acesse a URL oculta: `/admin.html`.
   - *Dica:* Pode ser encontrada inspecionando o código fonte, verificando o `robots.txt` ou através de varredura de diretórios.
2. O terminal pede uma senha e mostra um hash MD5 como pista: `46ea1712d4b13b55b3f680cc5b8b54e8`.
3. **Solução:** Decodifique o hash MD5 (use sites como md5decrypt.net).
   - Senha: **`pentest`**

## 📻 Passo 2: A Interceptação (Network)
1. Ao digitar `pentest`, o terminal exibe: `O BARULHO NÃO FOI VOCÊ...`.
2. Um áudio começa a tocar em background, mas não há player visível na tela.
3. **Solução:** Abra o **DevTools (F12) > Network (Rede)**.
   - Encontre a requisição do arquivo `SecretFile.wav`.
   - Baixe o arquivo e escute. Trata-se de um Código Morse.
   - Decodificação: **`AS IMAGENS GUARDAM SEGREDOS`**
4. Digite a frase decodificada no input do terminal.

## 🖼️ Passo 3: Esteganografia
1. O terminal confirma e dá a dica: *"A mensagem está bem clara"*.
2. Isso indica que você deve procurar segredos dentro das imagens visíveis do site.
3. **Solução:** Baixe a imagem principal `assets/logo.png`.
   - Use uma ferramenta de Esteganografia (ex: Steganography Online ou `steghide`).
   - Extraia o conteúdo oculto (sem senha ou senha vazia).
   - Conteúdo revelado: **`34.1341, -118.3217`**

## 🌎 Passo 4: OSINT (Geolocalização)
1. Pesquise as coordenadas `34.1341, -118.3217` no Google Maps.
2. **Solução:** O local aponta exatamente para o **Letreiro de Hollywood**.
3. A palavra-chave secreta é: **`hollywood`**.

## 🔓 Passo 5: O Código Final
1. Volte para a página inicial (`index.html`) ou permaneça onde está.
2. **Solução:** Digite no teclado a palavra **`hollywood`** (como se fosse um cheat code de jogo).
3. O "Efeito Matrix" é ativado, o áudio final toca e a mensagem de vitória aparece.

---
**Parabéns, você chegou ao fim da toca do coelho! 🐇**