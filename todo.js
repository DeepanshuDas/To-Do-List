document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById('task-input');
    const taskBtn = document.getElementById('task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todocontainerlist = document.querySelector('.todo-Container-list');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    const toggleEmptyState = () => {
        emptyImage.style.display =
            taskList.children.length === 0 ? 'block' : 'none';

        todocontainerlist.style.width =
            taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = () => {
    const totalTasks = taskList.children.length;
    const completedTasks =
        taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks
            ? `${(completedTasks / totalTasks) * 100}%`
            : '0%';

        progressNumbers.textContent =
            `${completedTasks} / ${totalTasks}`;
    };


    const loadTasksFromLocalStorage = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

  savedTasks.forEach(({ text, completed }) => {
    addTask(text, completed, false);
  });

  toggleEmptyState();
};

    


    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-btn">
                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
        });

        editBtn.addEventListener('click', () => {
            taskInput.value = li.querySelector('span').textContent;
            li.remove();
            toggleEmptyState();
            updateProgress(false);
        });

        deleteBtn.addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress(); 
        })      

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkCompletion);
    };

    taskBtn.addEventListener("click", (e) => {
  e.preventDefault();   // 🚫 stops page refresh
  addTask();
});

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    toggleEmptyState();
});
