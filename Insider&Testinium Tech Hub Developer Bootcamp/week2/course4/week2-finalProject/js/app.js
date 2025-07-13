import TaskManager from './taskManager.js';

class App {
    constructor() {
        this.taskManager = new TaskManager();
        this.elements = {
            taskForm: document.getElementById('taskForm'),
            taskList: document.getElementById('taskList'),
            errorMessage: document.getElementById('errorMessage'),
            successMessage: document.getElementById('successMessage'),
            filterAll: document.getElementById('filterAll'),
            filterCompleted: document.getElementById('filterCompleted'),
            filterPending: document.getElementById('filterPending'),
            sortByPriority: document.getElementById('sortByPriority'),

            startTimer: document.getElementById('startTimer'),
            pauseTimer: document.getElementById('pauseTimer'),
            resetTimer: document.getElementById('resetTimer'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            modeText: document.getElementById('modeText')
        };
        
        this.pomodoroState = {
            isRunning: false,
            isWorkMode: true,
            timeLeft: 25 * 60,
            interval: null
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.elements.taskForm.addEventListener('submit', (e) => {
            this.handleTaskSubmit(e);
        });

        this.elements.taskList.addEventListener('click', (e) => {
            this.handleTaskListClick(e);
        });

        this.elements.filterAll.addEventListener('click', () => {
            this.taskManager.setFilter('all');
            this.updateFilterButtons('all');
            this.render();
        });

        this.elements.filterCompleted.addEventListener('click', () => {
            this.taskManager.setFilter('completed');
            this.updateFilterButtons('completed');
            this.render();
        });

        this.elements.filterPending.addEventListener('click', () => {
            this.taskManager.setFilter('pending');
            this.updateFilterButtons('pending');
            this.render();
        });

        this.elements.sortByPriority.addEventListener('click', () => {
            this.taskManager.setSortByPriority();
            this.render();
        });

        this.elements.startTimer.addEventListener('click', () => {
            this.startPomodoro();
        });

        this.elements.pauseTimer.addEventListener('click', () => {
            this.pausePomodoro();
        });

        this.elements.resetTimer.addEventListener('click', () => {
            this.resetPomodoro();
        });
    }

    handleTaskSubmit(e) {
        e.preventDefault();

        try {
            const formData = new FormData(this.elements.taskForm);
            const taskData = {
                title: formData.get('title'),
                description: formData.get('description'),
                priority: formData.get('priority')
            };

            if (!taskData.title || taskData.title.trim() === '') {
                throw new Error('Görev başlığı boş olamaz!');
            }

            if (!taskData.priority) {
                throw new Error('Öncelik seçimi zorunludur!');
            }

            if (taskData.title.length > 100) {
                throw new Error('Görev başlığı çok uzun! (Max 100 karakter)');
            }

            this.taskManager.addTask(taskData);
            this.clearForm();
            this.showSuccess('Görev başarıyla eklendi!');
            this.render();

        } catch (error) {
            this.showError(error.message);
        }
    }

    handleTaskListClick(e) {
        e.stopPropagation();

        const action = e.target.dataset.action;
        const taskId = parseInt(e.target.dataset.taskId);

        if (!action || !taskId) return;

        try {
            switch (action) {
                case 'complete':
                    this.taskManager.toggleTaskCompletion(taskId);
                    this.showSuccess('Görev durumu güncellendi!');
                    break;
                case 'delete':
                    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
                        this.taskManager.deleteTask(taskId);
                        this.showSuccess('Görev silindi!');
                    }
                    break;
            }
            this.render();
        } catch (error) {
            this.showError('Bir hata oluştu: ' + error.message);
        }
    }

    render() {
        const tasks = this.taskManager.getFilteredTasks();
        const taskListHTML = tasks.length === 0 ? this.getEmptyStateHTML() : tasks.map(task => this.getTaskHTML(task)).join('');
        this.elements.taskList.innerHTML = taskListHTML;
    }

    getTaskHTML(task) {
        const priorityText = {
            high: 'Yüksek 🎖️🎖️🎖️',
            medium: 'Orta 🎖️🎖️',
            low: 'Düşük 🎖️'
        };

        return `
                    <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
                        <div class="task-header">
                            <div>
                                <div class="task-title">${this.escapeHtml(task.title)}</div>
                                <div class="task-priority ${task.priority}">
                                    ${priorityText[task.priority]}
                                </div>
                            </div>
                        </div>
                        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                        <div class="task-actions">
                            <button class="btn btn-success" data-action="complete" data-task-id="${task.id}">
                                ${task.completed ? 'Geri Al' : 'Tamamla'}
                            </button>
                            <button class="btn btn-danger" data-action="delete" data-task-id="${task.id}">
                                Sil
                            </button>
                        </div>
                    </div>
                `;
    }

    getEmptyStateHTML() {
        const messages = {
            'all': 'Henüz görev yok',
            'completed': 'Tamamlanan görev yok',
            'pending': 'Bekleyen görev yok'
        };

        return `
                    <div class="empty-state">
                        <h3>${messages[this.taskManager.currentFilter]}</h3>
                        <p>Yukarıdaki formu kullanarak yeni görev ekleyin!</p>
                    </div>
                `;
    }

    clearForm() {
        this.elements.taskForm.reset();
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        setTimeout(() => {
            this.elements.errorMessage.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        this.elements.successMessage.textContent = message;
        this.elements.successMessage.style.display = 'block';
        setTimeout(() => {
            this.elements.successMessage.style.display = 'none';
        }, 3000);
    }

    updateFilterButtons(activeFilter) {
        const buttons = [this.elements.filterAll, this.elements.filterCompleted, this.elements.filterPending];
        buttons.forEach(btn => btn.classList.remove('active'));

        if (activeFilter === 'all') this.elements.filterAll.classList.add('active');
        if (activeFilter === 'completed') this.elements.filterCompleted.classList.add('active');
        if (activeFilter === 'pending') this.elements.filterPending.classList.add('active');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    startPomodoro() {
        if (!this.pomodoroState.isRunning) {
            this.pomodoroState.isRunning = true;
            this.elements.startTimer.disabled = true;
            this.elements.pauseTimer.disabled = false;
            
            this.pomodoroState.interval = setInterval(() => {
                this.pomodoroState.timeLeft--;
                this.updateTimerDisplay();
                
                if (this.pomodoroState.timeLeft <= 0) {
                    this.handleTimerComplete();
                }
            }, 1000);
        }
    }

    pausePomodoro() {
        if (this.pomodoroState.isRunning) {
            this.pomodoroState.isRunning = false;
            this.elements.startTimer.disabled = false;
            this.elements.pauseTimer.disabled = true;
            clearInterval(this.pomodoroState.interval);
        }
    }

    resetPomodoro() {
        this.pausePomodoro();
        this.pomodoroState.timeLeft = this.pomodoroState.isWorkMode ? 25 * 60 : 5 * 60;
        this.updateTimerDisplay();
        this.elements.startTimer.disabled = false;
        this.elements.pauseTimer.disabled = true;
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.pomodoroState.timeLeft / 60);
        const seconds = this.pomodoroState.timeLeft % 60;
        
        this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
    }

    handleTimerComplete() {
        this.pausePomodoro();
        
        if (this.pomodoroState.isWorkMode) {
            this.pomodoroState.isWorkMode = false;
            this.pomodoroState.timeLeft = 5 * 60; // 5 minutes break
            this.elements.modeText.textContent = 'Mola Modu';
            this.showSuccess('Çalışma süresi tamamlandı! 5 dakika mola zamanı.');
        } else {
            this.pomodoroState.isWorkMode = true;
            this.pomodoroState.timeLeft = 25 * 60; // 25 minutes work
            this.elements.modeText.textContent = 'Çalışma Modu';
            this.showSuccess('Mola süresi tamamlandı! Yeni çalışma seansına başlayabilirsiniz.');
        }
        
        this.updateTimerDisplay();
        
        this.playNotificationSound();
    }

    playNotificationSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});