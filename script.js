let queue = [];
let history = [];
let completedCount = 0;

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    document.getElementById('theme-toggle').innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

function addTask() {
    const name = document.getElementById('taskName').value;
    const prio = parseInt(document.getElementById('taskPrio').value);
    const duration = parseInt(document.getElementById('duration').value) || 15;
    const category = document.getElementById('category').value;

    if (!name) return;

    const task = { name, prio, duration, category, id: Date.now() };
    queue.push(task);
    queue.sort((a, b) => a.prio - b.prio); // Simulated Binary Heap Logic

    render();
    document.getElementById('taskName').value = "";
    document.getElementById('duration').value = "";
}

function processTask() {
    if (queue.length === 0) return;
    history.unshift(queue.shift());
    completedCount++;
    render();
}

function undo() {
    if (history.length === 0) return;
    queue.push(history.shift());
    queue.sort((a, b) => a.prio - b.prio);
    completedCount = Math.max(0, completedCount - 1);
    render();
}

function render() {
    const qDiv = document.getElementById('queueDisplay');
    const hDiv = document.getElementById('historyDisplay');
    let totalMinutes = 0;


    if (queue.length === 0) {
        qDiv.innerHTML = `
            <div style="text-align:center; padding-top:40px; color:gray; opacity:0.5;">
                <i class="fas fa-mug-hot fa-2x"></i>
                <p style="margin-top:10px;">Queue is empty. Take a break!</p>
            </div>`;
    } else {
        qDiv.innerHTML = queue.map(t => {
            totalMinutes += t.duration;
            // Select icon based on priority
            const iconClass = t.prio === 1 ? 'fa-circle-exclamation prio-1' :
                             (t.prio === 3 ? 'fa-circle-info prio-3' : 'fa-circle-check prio-5');

            return `
                <div class="task-card prio-${t.prio}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong><i class="fas ${iconClass} prio-icon"></i> ${t.name}</strong>
                        <span class="tag">${t.category}</span>
                    </div>
                    <div style="margin-top:8px; font-size:0.85rem; color:#94a3b8;">
                        <i class="far fa-clock"></i> ${t.duration} mins
                    </div>
                </div>`;
        }).join('');
    }


    hDiv.innerHTML = history.map(t => `
        <div class="task-card" style="border-left-color: #475569; opacity: 0.6;">
            <strong><i class="fas fa-check-double" style="color:#10b981; margin-right:8px;"></i> ${t.name}</strong>
        </div>
    `).join('');


    document.getElementById('ect-display').innerText = `Total Workload: ${totalMinutes} mins`;
    const totalTasks = history.length + queue.length;
    const progress = totalTasks === 0 ? 0 : (history.length / totalTasks) * 100;
    document.getElementById('app-progress').style.width = progress + "%";
}