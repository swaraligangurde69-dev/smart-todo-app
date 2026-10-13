const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

const db = window.supabaseClient;

// Display messages
function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? "red" : "green";
}

// Load tasks
async function loadTasks() {
    const { data, error } = await db
        .from("public_tasks")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        showMessage("Error loading tasks: " + error.message, true);
        console.error(error);
        return;
    }

    taskList.replaceChildren();

    data.forEach(task => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            updateTask(task.id, checkbox.checked);
        });

        // Task title
        const title = document.createElement("span");
        title.textContent = task.title;

        // EDIT BUTTON
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", async () => {
            const newTitle = prompt("Enter the updated task:", task.title);

            if (newTitle === null) return;

            const updatedTitle = newTitle.trim();

            if (updatedTitle === "") {
                alert("Task cannot be empty!");
                return;
            }

            const { error } = await db
                .from("public_tasks")
                .update({ title: updatedTitle })
                .eq("id", task.id);

            if (error) {
                showMessage("Error editing task: " + error.message, true);
                console.error(error);
                return;
            }

            showMessage("Task edited successfully!");
            await loadTasks();
        });

        // DELETE BUTTON
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        // Add elements to task
        li.append(checkbox, title, editBtn, deleteBtn);
        taskList.appendChild(li);
    });
}

// Add task
async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        showMessage("Please enter a task!", true);
        return;
    }

    addTaskBtn.disabled = true;

    const { error } = await db
        .from("public_tasks")
        .insert([{ title: title, completed: false }]);

    addTaskBtn.disabled = false;

    if (error) {
        showMessage("Error adding task: " + error.message, true);
        console.error(error);
        return;
    }

    taskInput.value = "";
    showMessage("Task added successfully!");
    await loadTasks();
}

// Update task completion
async function updateTask(id, completed) {
    const { error } = await db
        .from("public_tasks")
        .update({ completed: completed })
        .eq("id", id);

    if (error) {
        showMessage("Error updating task: " + error.message, true);
        console.error(error);
        await loadTasks();
        return;
    }

    showMessage("Task updated successfully!");
    await loadTasks();
}

// Delete task
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    const { error } = await db
        .from("public_tasks")
        .delete()
        .eq("id", id);

    if (error) {
        showMessage("Error deleting task: " + error.message, true);
        console.error(error);
        return;
    }

    showMessage("Task deleted successfully!");
    await loadTasks();
}

// Add button event
addTaskBtn.addEventListener("click", addTask);

// Add task using Enter key
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load tasks when the app opens
loadTasks();