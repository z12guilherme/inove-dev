document.addEventListener('DOMContentLoaded', () => {
    let currentFilter = 'all';
    const ticketList = document.getElementById('ticketList');
    const btnSaveTicket = document.getElementById('btnSaveTicket');

    // Dados iniciais para demonstração
    const defaultTickets = [
        { id: 'TK-2024-003', subject: 'Dúvida sobre relatório de vendas', dept: 'Dúvida', priority: 'low', status: 'Respondido', user: 'Gerência', time: 'ontem', type: 'all' },
        { id: 'TK-2024-002', subject: 'Solicitação de novo usuário no sistema', dept: 'Acesso', priority: 'medium', status: 'Em Andamento', user: 'RH Dept', time: 'há 5 horas', type: 'meus' },
        { id: 'TK-2024-001', subject: 'Erro ao processar pagamento no checkout', dept: 'Financeiro', priority: 'high', status: 'Em Aberto', user: 'Loja Exemplo', time: 'há 2 horas', type: 'all' }
    ];

    window.filterTickets = function(type, element) {
        currentFilter = type;
        document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active'));
        if(element) element.classList.add('active');

        const tickets = document.querySelectorAll('.ticket-card');
        tickets.forEach(ticket => {
            if (type === 'all' || ticket.dataset.type === type) {
                ticket.style.display = 'block';
            } else {
                ticket.style.display = 'none';
            }
        });
    };

    function loadTickets() {
        if (!ticketList) return;
        
        let storedTickets = JSON.parse(localStorage.getItem('helpdesk_tickets'));
        
        if (!storedTickets || storedTickets.length === 0) {
            storedTickets = defaultTickets;
            localStorage.setItem('helpdesk_tickets', JSON.stringify(storedTickets));
        }

        const header = ticketList.querySelector('.d-flex.justify-content-between');
        ticketList.innerHTML = '';
        if(header) ticketList.appendChild(header);

        [...storedTickets].reverse().forEach(ticket => renderTicketCard(ticket));
        
        const activeFilterBtn = document.querySelector('.list-group-item.active');
        if(activeFilterBtn) {
            const onclickAttr = activeFilterBtn.getAttribute('onclick');
            if(onclickAttr) {
                const type = onclickAttr.match(/'([^']+)'/)[1];
                window.filterTickets(type, activeFilterBtn);
            }
        }
    }

    function renderTicketCard(ticket) {
        const card = document.createElement('div');
        
        let borderClass = ticket.priority === 'high' ? 'ticket-high' : (ticket.priority === 'medium' ? 'ticket-medium' : 'ticket-low');
        let badgeClass = ticket.priority === 'high' ? 'bg-danger' : (ticket.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success');
        let priorityLabel = ticket.priority === 'high' ? 'Alta' : (ticket.priority === 'medium' ? 'Média' : 'Baixa');
        
        card.className = `card mb-3 border-0 shadow-sm ticket-card ${borderClass}`;
        card.setAttribute('data-type', ticket.type || 'meus');
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title mb-1"><a href="#" class="text-decoration-none text-dark">${ticket.subject}</a></h5>
                        <p class="text-muted small mb-2">#${ticket.id} • Aberto por <strong>${ticket.user || 'Você'}</strong> • ${ticket.time || 'Agora mesmo'}</p>
                        <span class="badge ${badgeClass}">${priorityLabel} Prioridade</span>
                        <span class="badge bg-secondary">${ticket.dept}</span>
                    </div>
                    <div class="text-end">
                        <span class="status-badge bg-light text-primary border border-primary">${ticket.status || 'Novo'}</span>
                        <div class="mt-2 d-flex gap-2 justify-content-end">
                            <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteTicket('${ticket.id}')" title="Excluir"><i class="bi bi-trash"></i></button>
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.user || 'Você')}&background=random" class="rounded-circle" width="30" height="30" title="${ticket.user || 'Você'}">
                        </div>
                    </div>
                </div>
            </div>
        `;
        ticketList.appendChild(card);
    }

    if(btnSaveTicket) {
        btnSaveTicket.addEventListener('click', () => {
            const subjectInput = document.querySelector('#newTicketForm input[type="text"]');
            const deptSelect = document.querySelector('#newTicketForm select:nth-of-type(1)');
            const prioritySelect = document.querySelector('#newTicketForm select:nth-of-type(2)');
            
            if(subjectInput && subjectInput.value) {
                const newTicket = { 
                    id: 'TK-' + Math.floor(Math.random() * 9000 + 1000),
                    subject: subjectInput.value, 
                    dept: deptSelect.value, 
                    priority: prioritySelect.value, 
                    status: 'Novo', 
                    user: 'Você', 
                    time: 'Agora mesmo', 
                    type: 'meus', 
                    date: new Date().toISOString() 
                };
                const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets') || '[]');
                tickets.push(newTicket);
                localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
                
                loadTickets();
                
                const modalEl = document.getElementById('newTicketModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                if(modal) modal.hide();
                
                document.getElementById('newTicketForm').reset();
            } else {
                alert("Por favor, preencha o assunto.");
            }
        });
    }

    window.deleteTicket = function(id) {
        if(confirm('Deseja excluir este chamado?')) {
            let tickets = JSON.parse(localStorage.getItem('helpdesk_tickets') || '[]');
            tickets = tickets.filter(t => t.id !== id);
            localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
            loadTickets();
        }
    };

    loadTickets();
});
