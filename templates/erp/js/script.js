document.addEventListener('DOMContentLoaded', () => {
    // --- Active Menu Logic ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar .nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if(sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Carregar tema salvo
    if (localStorage.getItem('erp_theme') === 'dark') {
        body.classList.add('dark-mode');
        if(darkModeToggle) darkModeToggle.querySelector('i').classList.replace('bi-moon', 'bi-sun');
    }

    if(darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            if(body.classList.contains('dark-mode')) {
                icon.classList.replace('bi-moon', 'bi-sun');
                localStorage.setItem('erp_theme', 'dark');
            } else {
                icon.classList.replace('bi-sun', 'bi-moon');
                localStorage.setItem('erp_theme', 'light');
            }
        });
    }

    // Charts Configuration (Apenas se o elemento existir)
    if (document.getElementById('salesChart')) {
        const ctxSales = document.getElementById('salesChart').getContext('2d');
        
        // Gradient for Line Chart
        const gradientSales = ctxSales.createLinearGradient(0, 0, 0, 400);
        gradientSales.addColorStop(0, 'rgba(67, 97, 238, 0.5)');
        gradientSales.addColorStop(1, 'rgba(67, 97, 238, 0.0)');

        new Chart(ctxSales, {
            type: 'line',
            data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Vendas (R$)',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Será preenchido pelo updateDashboardStats
                    borderColor: '#4361ee',
                    backgroundColor: gradientSales,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    if (document.getElementById('categoryChart')) {
        const ctxCategory = document.getElementById('categoryChart').getContext('2d');
        new Chart(ctxCategory, {
            type: 'doughnut',
            data: {
                labels: ['Eletrônicos', 'Roupas', 'Casa', 'Outros'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#4361ee', '#3f37c9', '#4cc9f0', '#e5e7eb'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                cutout: '70%'
            }
        });
    }

    // --- ERP Interaction Logic (LocalStorage) ---
    const ordersTableBody = document.getElementById('ordersTableBody');
    const btnNewOrder = document.getElementById('btnNewOrder');

    // Dados iniciais se estiver vazio
    const defaultOrders = [
        { id: '#ORD-001', client: 'John Doe', date: '12 jan. 2024', value: 'R$ 450,00', status: 'Concluído' },
        { id: '#ORD-002', client: 'Alice Smith', date: '12 jan. 2024', value: 'R$ 1.250,00', status: 'Pendente' },
        { id: '#ORD-003', client: 'Robert Fox', date: '11 fev. 2024', value: 'R$ 89,90', status: 'Cancelado' },
        { id: '#ORD-004', client: 'Jane Cooper', date: '15 mar. 2024', value: 'R$ 2.400,00', status: 'Concluído' }
    ];

    function updateDashboardStats() {
        const orders = JSON.parse(localStorage.getItem('erp_orders') || '[]');
        
        let revenue = 0;
        let clients = new Set();
        const salesByMonth = new Array(12).fill(0); // Jan-Dez
        
        console.log("Calculando estatísticas para " + orders.length + " pedidos...");

        orders.forEach(order => {
            if (!order.value) return; 

            // Parse Valor Robusto
            let valStr = order.value.toString().replace(/[^\d,.-]/g, ''); 
            if (valStr.includes(',')) {
                valStr = valStr.replace(/\./g, '').replace(',', '.');
            }
            const val = parseFloat(valStr) || 0;
            
            // Apenas soma se estiver Concluído
            const status = (order.status || '').toLowerCase();
            if (status.includes('conclu')) {
                revenue += val;

                // Parse Data para o Gráfico
                const cleanDate = (order.date || '').toLowerCase().replace(/ de /g, ' ').replace(/\./g, '').trim();
                const parts = cleanDate.split(' ');
                
                if (parts.length >= 2 && parts[1]) {
                    const monthStr = parts[1].substring(0, 3);
                    const monthMap = { 'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3, 'mai': 4, 'jun': 5, 'jul': 6, 'ago': 7, 'set': 8, 'out': 9, 'nov': 10, 'dez': 11 };
                    if (monthMap.hasOwnProperty(monthStr)) {
                        salesByMonth[monthMap[monthStr]] += val;
                    }
                }
            }
            
            if(order.client) clients.add(order.client);
        });

        const totalOrders = orders.length;
        const avgTicket = totalOrders > 0 ? revenue / totalOrders : 0;

        // Atualiza Cards
        const elRevenue = document.getElementById('totalRevenue');
        const elOrders = document.getElementById('totalOrders');
        const elClients = document.getElementById('totalClients');
        const elTicket = document.getElementById('avgTicket');

        if(elRevenue) elRevenue.textContent = revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        if(elOrders) elOrders.textContent = totalOrders;
        if(elClients) elClients.textContent = clients.size;
        if(elTicket) elTicket.textContent = avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Atualiza Gráfico de Vendas
        const chartCanvas = document.getElementById('salesChart');
        if (chartCanvas) {
            const chartInstance = Chart.getChart(chartCanvas);
            if (chartInstance) {
                chartInstance.data.datasets[0].data = salesByMonth;
                chartInstance.update();
            }
        }
    }

    function loadOrders() {
        let storedOrders = JSON.parse(localStorage.getItem('erp_orders'));
        if (!storedOrders) {
            storedOrders = defaultOrders;
            localStorage.setItem('erp_orders', JSON.stringify(storedOrders));
        }
        
        if (ordersTableBody) {
            ordersTableBody.innerHTML = ''; 
            storedOrders.forEach(order => renderOrderRow(order));
        }
        
        // Atualiza os cards e gráficos sempre que carregar pedidos
        updateDashboardStats();
    }

    function renderOrderRow(order) {
        if (!ordersTableBody) return;
        const row = document.createElement('tr');
        
        let statusBadge = '';
        let actionButtons = '';

        if (order.status === 'Concluído') {
            statusBadge = '<span class="status-badge status-success">Concluído</span>';
            actionButtons = `<button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${order.id}')" title="Excluir"><i class="bi bi-trash"></i></button>`;
        } else if (order.status === 'Cancelado') {
            statusBadge = '<span class="status-badge status-danger">Cancelado</span>';
            actionButtons = `<button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${order.id}')" title="Excluir"><i class="bi bi-trash"></i></button>`;
        } else {
            statusBadge = '<span class="status-badge status-warning">Pendente</span>';
            actionButtons = `
                <button class="btn btn-sm btn-outline-success me-1" onclick="completeOrder('${order.id}')" title="Concluir"><i class="bi bi-check-lg"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${order.id}')" title="Excluir"><i class="bi bi-trash"></i></button>
            `;
        }

        row.innerHTML = `
            <td>${order.id}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(order.client)}&background=random" class="rounded-circle" width="24" height="24">
                    <span>${order.client}</span>
                </div>
            </td>
            <td>${order.date}</td>
            <td>${order.value}</td>
            <td>${statusBadge}</td>
            <td>${actionButtons}</td>
        `;
        // Prepend to show first
        ordersTableBody.insertBefore(row, ordersTableBody.firstChild);
    }

    if(btnNewOrder) {
        btnNewOrder.addEventListener('click', () => {
            const clientName = prompt("Nome do Cliente para o novo pedido:");
            if (clientName) {
                // Sugere um valor aleatório, mas permite o usuário alterar
                const randomValue = (Math.random() * 500 + 50).toFixed(2).replace('.', ',');
                const valueInput = prompt("Valor do Pedido (R$):", randomValue);
                const finalValue = valueInput ? `R$ ${valueInput}` : `R$ ${randomValue}`;

                const newOrder = {
                    id: '#ORD-' + Math.floor(Math.random() * 9000 + 1000),
                    client: clientName,
                    date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                    value: finalValue,
                    status: 'Pendente'
                };
                
                // Lê, Adiciona e Salva no LocalStorage com garantia
                let orders = JSON.parse(localStorage.getItem('erp_orders') || '[]');
                orders.push(newOrder);
                localStorage.setItem('erp_orders', JSON.stringify(orders));
                
                console.log("Pedido salvo com sucesso:", newOrder);
                console.log("Total de pedidos no LocalStorage:", orders.length);

                renderOrderRow(newOrder);
                updateDashboardStats(); // Atualiza stats ao adicionar
            }
        });
    }

    // Tornar global para ser acessível via onclick no HTML
    window.completeOrder = function(id) {
        let orders = JSON.parse(localStorage.getItem('erp_orders') || '[]');
        const orderIndex = orders.findIndex(o => o.id === id);
        if (orderIndex > -1) {
            orders[orderIndex].status = 'Concluído';
            localStorage.setItem('erp_orders', JSON.stringify(orders));
            loadOrders();
        }
    };

    // Tornar global para ser acessível via onclick no HTML
    window.deleteOrder = function(id) {
        if(confirm('Tem certeza que deseja excluir este pedido?')) {
            let orders = JSON.parse(localStorage.getItem('erp_orders') || '[]');
            orders = orders.filter(order => order.id !== id);
            localStorage.setItem('erp_orders', JSON.stringify(orders));
            
            loadOrders();
            // updateDashboardStats já é chamado dentro de loadOrders
        }
    };

    // Load saved orders on startup
    loadOrders();

    // --- Products Logic ---
    const productsTableBody = document.getElementById('productsTableBody');
    const btnNewProduct = document.getElementById('btnNewProduct');

    // Definindo produtos padrão fora da função para serem acessíveis globalmente
    const defaultProducts = [
        { id: 1, name: 'Notebook Dell', category: 'Eletrônicos', price: 'R$ 3.500', stock: 12 },
        { id: 2, name: 'Mouse Sem Fio', category: 'Acessórios', price: 'R$ 85,00', stock: 45 },
        { id: 3, name: 'Teclado Mecânico', category: 'Acessórios', price: 'R$ 250,00', stock: 8 }
    ];

    function loadProducts() {
        // Inicializa o localStorage com dados padrão se estiver vazio
        let products = JSON.parse(localStorage.getItem('erp_products'));
        if (!products) {
            products = defaultProducts;
            localStorage.setItem('erp_products', JSON.stringify(products));
        }
        
        if (!productsTableBody) return;

        productsTableBody.innerHTML = '';
        products.forEach(p => renderProductRow(p));
    }

    function renderProductRow(p) {
        if (!productsTableBody) return;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold">${p.name}</td>
            <td><span class="badge bg-light text-dark border">${p.category}</span></td>
            <td>${p.price}</td>
            <td>${p.stock} un.</td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})"><i class="bi bi-trash"></i></button></td>
        `;
        productsTableBody.appendChild(row);
    }

    if(btnNewProduct) {
        btnNewProduct.addEventListener('click', () => {
            const name = prompt("Nome do Produto:");
            if(name) {
                // Garante que pega a lista atualizada ou inicia com padrão
                let products = JSON.parse(localStorage.getItem('erp_products'));
                if (!products) products = defaultProducts;

                products.push({ id: Date.now(), name: name, category: 'Geral', price: 'R$ 0,00', stock: 0 });
                localStorage.setItem('erp_products', JSON.stringify(products));
                loadProducts();
            }
        });
    }

    window.deleteProduct = function(id) {
        if(confirm("Excluir este produto?")) {
            let products = JSON.parse(localStorage.getItem('erp_products'));
            if (!products) products = defaultProducts;

            products = products.filter(p => p.id !== id);
            localStorage.setItem('erp_products', JSON.stringify(products));
            loadProducts();
        }
    };

    loadProducts();
});
