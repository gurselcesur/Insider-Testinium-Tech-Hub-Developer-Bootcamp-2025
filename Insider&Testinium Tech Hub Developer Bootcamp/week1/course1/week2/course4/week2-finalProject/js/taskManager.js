class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.currentFilter = 'all';
        this.currentSort = 'none';
    }

    addTask(taskData) {
        const task = {
            id: this.taskIdCounter++,
            title: taskData.title.trim(),
            description: taskData.description.trim(),
            priority: taskData.priority,
            completed: false,
            createdAt: new Date()
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
        }
    }

    getFilteredTasks() {
        let filteredTasks = [...this.tasks];

        if (this.currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        } else if (this.currentFilter === 'pending') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        }

        if (this.currentSort === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        }

        return filteredTasks;
    }

    setFilter(filter) {
        this.currentFilter = filter;
    }

    setSortByPriority() {
        this.currentSort = this.currentSort === 'priority' ? 'none' : 'priority';
    }
}
export default TaskManager;