document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    // Configuração da Cena
    const scene = new THREE.Scene();
    
    // Câmera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderizador com fundo transparente para mesclar com o CSS
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Criação das Partículas (Geometria)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700; // Quantidade de partículas

    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Espalha as partículas aleatoriamente em uma área grande
        posArray[i] = (Math.random() - 0.5) * 60; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material das Partículas (Aparência)
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00C7B7, // Cor da marca (Verde Água)
        transparent: true,
        opacity: 0.8,
    });

    // Mesh (Objeto final)
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Adicionar linhas conectando partículas próximas (Efeito Neural)
    // Nota: Para performance, não vamos conectar todas, apenas criar um wireframe secundário
    const wireframeGeometry = new THREE.IcosahedronGeometry(15, 1);
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4361ee, // Azul secundário
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeSphere);

    // Interação com Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animação (Loop)
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Rotação suave baseada no tempo
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Rotação suave baseada no mouse (interatividade)
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Animação da esfera wireframe (gira ao contrário)
        wireframeSphere.rotation.y = -elapsedTime * 0.05;
        wireframeSphere.rotation.x = -elapsedTime * 0.02;

        // Efeito de onda nas partículas (opcional, mais avançado)
        // Acessar posições e modificar Y baseado em seno/cosseno se quiser movimento orgânico

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Responsividade (Resize)
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});