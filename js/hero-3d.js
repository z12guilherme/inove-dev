document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    // Configuração da Cena
    const scene = new THREE.Scene();

    // Câmera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 45;

    // Renderizador com foco em Performance e Antialiasing
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Adicionando uma luz de hemisfério para iluminação global mais orgânica
    const hemisphereLight = new THREE.HemisphereLight(0x00C7B7, 0x050a12, 1.2);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0x00C7B7, 2, 150);
    pointLight.position.set(20, 30, 20);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x4361ee, 2, 150);
    pointLight2.position.set(-20, -30, 20);
    scene.add(pointLight2);

    const group = new THREE.Group();
    scene.add(group);

    // --- OBJETO CENTRAL (TORUS KNOT) COM SHADERS SIMULADOS ---
    const materialParams = {
        color: 0x050a12,
        emissive: 0x002220,
        roughness: 0.1,
        metalness: 1.0,
        transparent: true,
        opacity: 0.95
    };
    const mainMaterial = new THREE.MeshStandardMaterial(materialParams);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x00C7B7,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    const torusGeometry = new THREE.TorusKnotGeometry(8, 2.5, 200, 32);
    const mainMesh = new THREE.Mesh(torusGeometry, mainMaterial);

    // O wireframe vai ter vida própria
    const wireMesh = new THREE.Mesh(torusGeometry, wireMaterial);
    wireMesh.scale.setScalar(1.01);
    mainMesh.add(wireMesh);

    mainMesh.position.set(15, 0, -10);
    group.add(mainMesh);

    // Variáveis de controle físico do nó central
    mainMesh.userData = {
        targetScale: 1,
        spinSpeedX: 0.003,
        spinSpeedY: 0.005,
        targetWireScale: 1.01
    };

    // --- SATÉLITES FLUTUANTES (FÍSICA DE MOLA E REPULSÃO MAGNÉTICA) ---
    const satellites = [];
    const geometries = [
        new THREE.IcosahedronGeometry(2, 0),
        new THREE.OctahedronGeometry(2, 0),
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.TetrahedronGeometry(2.5, 0)
    ];

    for (let i = 0; i < 25; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geo, mainMaterial.clone());

        mesh.material.emissive.setHex(Math.random() > 0.5 ? 0x00C7B7 : 0x4361ee);
        mesh.material.emissiveIntensity = 0.2;

        // Âncora: Posição original para onde o objeto sempre tentará voltar
        const anchorX = (Math.random() - 0.5) * 80;
        const anchorY = (Math.random() - 0.5) * 50;
        const anchorZ = (Math.random() - 0.5) * 40 - 15;

        mesh.position.set(anchorX, anchorY, anchorZ);

        mesh.userData = {
            anchor: new THREE.Vector3(anchorX, anchorY, anchorZ),
            velocity: new THREE.Vector3(0, 0, 0), // Vetor de força
            rotX: (Math.random() - 0.5) * 0.04,
            rotY: (Math.random() - 0.5) * 0.04,
            offsetY: Math.random() * 10,
            speed: 0.5 + Math.random() * 1.5
        };

        group.add(mesh);
        satellites.push(mesh);
    }

    // --- PARTÍCULAS LÍQUIDAS (INTERAÇÃO COMO FLUIDO) ---
    const particlesCount = 800;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const particlesData = []; // Armazena a física individual de cada ponto

    for (let i = 0; i < particlesCount; i++) {
        const x = (Math.random() - 0.5) * 140;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 60 - 20;

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;

        particlesData.push({
            anchor: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(0, 0, 0)
        });
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x00C7B7,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending // Brilho extra ao se juntarem
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- CONTROLE DE MOUSE E ESTADOS ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;
    let shockwaveForce = 0; // Força da explosão ao clicar

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseX = (event.clientX - window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2);
    });

    document.addEventListener('mousedown', () => {
        isMouseDown = true;
        shockwaveForce = 5.0; // Gera a explosão

        // Efeito Magnético Forte no objeto central
        mainMesh.userData.targetScale = 0.7; // Contrai o núcleo
        mainMesh.userData.targetWireScale = 2.5; // Expande a casca
        mainMesh.material.emissiveIntensity = 3.0;
        document.body.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        // Solta a "Mola"
        mainMesh.userData.targetScale = 1;
        mainMesh.userData.targetWireScale = 1.01;
        mainMesh.material.emissiveIntensity = 0.5;
        document.body.style.cursor = 'default';
    });

    // --- LOOP FÍSICO E RENDERIZAÇÃO ---
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Mapeia a coordenada 2D do mouse para uma coordenada 3D no espaço do mundo
        const mouse3D = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        mouse3D.unproject(camera);
        const dir = mouse3D.sub(camera.position).normalize();
        const distanceToZ0 = -camera.position.z / dir.z;
        const cursorPosition = camera.position.clone().add(dir.multiplyScalar(distanceToZ0));

        // Parallax suave geral
        group.position.x += ((mouseX * 0.002) - group.position.x) * 0.02;
        group.position.y += ((-mouseY * 0.002) - group.position.y) * 0.02;

        // -- 1. INTERAÇÃO DO NÓ CENTRAL (Raycaster) --
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(mainMesh, false);

        if (intersects.length > 0 && !isMouseDown) {
            mainMesh.userData.spinSpeedX = 0.2;
            mainMesh.userData.spinSpeedY = 0.4; // Aceleração Brusca (Efeito Turbina)
            mainMesh.userData.targetScale = 1.1;
            mainMesh.userData.targetWireScale = 1.3; // Casca se solta
            mainMesh.material.emissiveIntensity = 1.5;
            document.body.style.cursor = 'grab';
        } else if (!isMouseDown) {
            mainMesh.userData.spinSpeedX += (0.003 - mainMesh.userData.spinSpeedX) * 0.05;
            mainMesh.userData.spinSpeedY += (0.005 - mainMesh.userData.spinSpeedY) * 0.05;
            mainMesh.userData.targetScale = 1;
            mainMesh.userData.targetWireScale = 1.01;
            mainMesh.material.emissiveIntensity = 0.5;
        }

        // Aplica a física no nó central usando Interpolação Linear (Lerp) para fluidez elástica
        mainMesh.rotation.y += mainMesh.userData.spinSpeedY;
        mainMesh.rotation.x += mainMesh.userData.spinSpeedX;
        mainMesh.scale.lerp(new THREE.Vector3().setScalar(mainMesh.userData.targetScale), 0.1);
        wireMesh.scale.lerp(new THREE.Vector3().setScalar(mainMesh.userData.targetWireScale), 0.15);

        // -- 2. DECAIMENTO DA ONDA DE CHOQUE --
        if (shockwaveForce > 0) shockwaveForce -= 0.15;
        if (shockwaveForce < 0) shockwaveForce = 0;

        // -- 3. FÍSICA DOS SATÉLITES (Molas e Campo de Repulsão) --
        satellites.forEach(obj => {
            // A) Repulsão do Mouse (Campo de Força)
            const distToCursor = obj.position.distanceTo(cursorPosition);
            if (distToCursor < 18) {
                const force = (18 - distToCursor) * 0.08;
                const dirAway = obj.position.clone().sub(cursorPosition).normalize();
                obj.userData.velocity.add(dirAway.multiplyScalar(force));

                obj.material.emissiveIntensity = 1.5; // Acende ao tocar o campo
                obj.scale.lerp(new THREE.Vector3(2.5, 2.5, 2.5), 0.2); // Infla
            } else {
                obj.material.emissiveIntensity = 0.2;
                obj.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1); // Murcha
            }

            // B) Explosão do Clique (Shockwave)
            if (shockwaveForce > 0) {
                const centerDist = obj.position.distanceTo(new THREE.Vector3(0, 0, 0));
                const shockDir = obj.position.clone().normalize();
                obj.userData.velocity.add(shockDir.multiplyScalar(shockwaveForce * (25 / Math.max(1, centerDist))));
            }

            // C) Força Elástica (Puxando de volta para a âncora)
            const currentAnchor = obj.userData.anchor.clone();
            currentAnchor.y += Math.sin(elapsedTime * obj.userData.speed * 0.5 + obj.userData.offsetY) * 4; // Float orgânico mais suave

            const springForce = currentAnchor.sub(obj.position).multiplyScalar(0.008); // Tensão da mola relaxada
            obj.userData.velocity.add(springForce);

            // D) Atrito do Ar (Damping)
            obj.userData.velocity.multiplyScalar(0.93); // Desliza mais suavemente

            // Aplica Vetor de Velocidade
            obj.position.add(obj.userData.velocity);

            // Rotação dinâmica com base na velocidade
            obj.rotation.x += obj.userData.rotX * 0.5 + (obj.userData.velocity.y * 0.02);
            obj.rotation.y += obj.userData.rotY * 0.5 + (obj.userData.velocity.x * 0.02);
        });

        // -- 4. FÍSICA DOS FLUIDOS (PARTÍCULAS) --
        // As partículas fogem do mouse como água sendo empurrada
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const data = particlesData[i];

            const targetX = data.anchor.x;
            const targetY = data.anchor.y + Math.sin(elapsedTime * 0.5 + data.anchor.x * 0.1) * 2;
            const targetZ = data.anchor.z;

            const px = positions[i * 3];
            const py = positions[i * 3 + 1];
            const pz = positions[i * 3 + 2];

            // Repulsão Magnética
            const dx = px - cursorPosition.x;
            const dy = py - cursorPosition.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 150) { // Raio da bolha de interação
                const dist = Math.sqrt(distSq);
                const force = (12 - dist) * 0.03;
                data.velocity.x += (dx / dist) * force;
                data.velocity.y += (dy / dist) * force;
            }

            // Onda de choque
            if (shockwaveForce > 0) {
                const distCenterSq = px * px + py * py;
                if (distCenterSq < 900) {
                    const distCenter = Math.sqrt(distCenterSq) || 1;
                    data.velocity.x += (px / distCenter) * shockwaveForce * 0.5;
                    data.velocity.y += (py / distCenter) * shockwaveForce * 0.5;
                }
            }

            // Tensão elástica de volta para a posição original (bem orgânica)
            data.velocity.x += (targetX - px) * 0.002;
            data.velocity.y += (targetY - py) * 0.002;
            data.velocity.z += (targetZ - pz) * 0.002;

            // Adiciona correntes fluidas (como plâncton/poeira estelar)
            data.velocity.x += Math.sin(elapsedTime * 0.2 + py * 0.05) * 0.015;
            data.velocity.y += Math.cos(elapsedTime * 0.2 + px * 0.05) * 0.015;

            data.velocity.multiplyScalar(0.95); // Atrito menor = flutuação suave

            positions[i * 3] += data.velocity.x;
            positions[i * 3 + 1] += data.velocity.y;
            positions[i * 3 + 2] += data.velocity.z;
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        particlesMesh.rotation.y = elapsedTime * 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});