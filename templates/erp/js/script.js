document.addEventListener('DOMContentLoaded', () => {
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
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Vendas (R$)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
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

    function loadOrders() {
        if (!ordersTableBody) return;
        const storedOrders = JSON.parse(localStorage.getItem('erp_orders') || '[]');
        ordersTableBody.innerHTML = ''; // Limpa antes de renderizar
        storedOrders.forEach(order => renderOrderRow(order));
    }

    function renderOrderRow(order) {
        if (!ordersTableBody) return;
        const row = document.createElement('tr');
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
            <td><span class="status-badge status-warning">${order.status}</span></td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="deleteOrder('${order.id}')" title="Excluir"><i class="bi bi-trash"></i></button></td>
        `;
        // Prepend to show first
        ordersTableBody.insertBefore(row, ordersTableBody.firstChild);
    }

    if(btnNewOrder) {
        btnNewOrder.addEventListener('click', () => {
            const clientName = prompt("Nome do Cliente para o novo pedido:");
            if (clientName) {
                const newOrder = {
                    id: '#ORD-' + Math.floor(Math.random() * 9000 + 1000),
                    client: clientName,
                    date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                    value: 'R$ ' + (Math.random() * 500 + 50).toFixed(2).replace('.', ','),
                    status: 'Pendente'
                };
                
                const orders = JSON.parse(localStorage.getItem('erp_orders') || '[]');
                orders.push(newOrder);
                localStorage.setItem('erp_orders', JSON.stringify(orders));
                
                renderOrderRow(newOrder);
            }
        });
    }

    // Tornar global para ser acessível via onclick no HTML
    window.deleteOrder = function(id) {
        if(confirm('Tem certeza que deseja excluir este pedido?')) {
            let orders = JSON.parse(localStorage.getItem('erp_orders') || '[]');
            orders = orders.filter(order => order.id !== id);
            localStorage.setItem('erp_orders', JSON.stringify(orders));
            
            loadOrders();
        }
    };

    // Load saved orders on startup
    loadOrders();
});
