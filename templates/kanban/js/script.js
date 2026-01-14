document.addEventListener('DOMContentLoaded', () => {
    const defaultTasks = [
        { id: 't1', title: 'Criar wireframes da Home', col: 'col-todo', tag: 'Design', tagClass: 'tag-design' },
        { id: 't2', title: 'Configurar banco de dados', col: 'col-progress', tag: 'Dev', tagClass: 'tag-dev' },
        { id: 't3', title: 'Reunião de Kickoff', col: 'col-done', tag: 'Geral', tagClass: 'tag-urgent' },
        { id: 't4', title: 'Corrigir bug no login', col: 'col-todo', tag: 'Bug', tagClass: 'tag-urgent' }
    ];

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('kanban_tasks')) || defaultTasks;
        
        // Limpar colunas
        ['col-todo', 'col-progress', 'col-done'].forEach(id => {
            const col = document.getElementById(id);
            if(col) col.innerHTML = '';
        });

        tasks.forEach(task => createCardElement(task));
    }

    function createCardElement(task) {
        const col = document.getElementById(task.col);
        if (!col) return;

        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.id = task.id;
        card.ondragstart = drag;
        
        card.innerHTML = `
            <i class="bi bi-x-lg delete-task-btn" onclick="deleteTask('${task.id}')" title="Excluir"></i>
            <div class="task-tags"><span class="task-tag ${task.tagClass}">${task.tag}</span></div>
            <div class="task-title">${task.title}</div>
            <div class="task-footer">
                <div class="task-id">#${task.id.toUpperCase()}</div>
                <div class="task-members"><img src="https://ui-avatars.com/api/?name=User&background=random" title="Responsável"></div>
            </div>
        `;
        col.appendChild(card);
    }

    // Funções Globais para Drag & Drop e Interação
    window.allowDrop = function(ev) { ev.preventDefault(); }
    
    window.drag = function(ev) { ev.dataTransfer.setData("text", ev.target.id); }
    
    window.drop = function(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var card = document.getElementById(data);
        
        let target = ev.target;
        // Subir até encontrar a coluna correta
        while (target && !target.classList.contains('column-content')) {
            target = target.parentElement;
        }
        
        if(target) {
            target.appendChild(card);
            saveState();
        }
    }

    window.addNewCard = function(columnId) {
        const title = prompt("Título da nova tarefa:");
        if (title) {
            const newTask = { 
                id: 't' + Date.now(), 
                title: title, 
                col: columnId, 
                tag: 'Geral', 
                tagClass: 'tag-dev' 
            };
            createCardElement(newTask);
            saveState();
        }
    }

    window.deleteTask = function(id) {
        if(confirm('Excluir esta tarefa?')) {
            const card = document.getElementById(id);
            if(card) card.remove();
            saveState();
        }
    }

    function saveState() {
        const tasks = [];
        ['col-todo', 'col-progress', 'col-done'].forEach(colId => {
            const col = document.getElementById(colId);
            if(!col) return;
            
            const cards = col.getElementsByClassName('task-card');
            for (let card of cards) {
                const tagSpan = card.querySelector('.task-tag');
                const titleDiv = card.querySelector('.task-title');
                
                if(tagSpan && titleDiv) {
                    tasks.push({
                        id: card.id,
                        title: titleDiv.innerText,
                        col: colId,
                        tag: tagSpan.innerText,
                        tagClass: tagSpan.classList[1] // assume classe como segundo item
                    });
                }
            }
        });
        localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
    }

    loadTasks();
});
