// ===============================
// TaskFlow - taskList.js
// ===============================

import { saveTasks, loadTasks } from "../utils/storage.js";
import { refreshUI } from "../app.js";

let currentDraggedId = null;
let currentDraggedOverId = null;

// Pour afficher les tâches stockées dans le stockage local  ////
export function renderTasks(filter = "all") {
  const taskListElement = document.querySelector(".task-list");
  const tasks = loadTasks();

  taskListElement.innerHTML = ""; // reset

    let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter(task => !task.done);
  }

  if (filter === "done") {
    filteredTasks = tasks.filter(task => task.done);
  }

  filteredTasks.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("task-item");
    if (task.done) div.classList.add("done");

    div.innerHTML = `
      <button class="toggle-task" data-id="${task.id}">
        ${task.done ? "✔" : "❌"}
      </button>
      <span class="taskText" data-id="${task.id}">${task.text}</span>
      <button class="delete-task" data-id="${task.id}">🗑️</button>
    `;

    configTask(div, tasks, task, refreshUI);

    taskListElement.appendChild(div);
  });


  // switch (filter) {
  //   case "all":
  //     tasks.forEach((task, id) => {
  //       const div = document.createElement("div");
  //       div.classList.add("task-item");

  //       if (task.done) div.classList.add("done");

  //       div.innerHTML = ` 
  //       <button class="toggle-task" data-id="${task.id}">
  //       ${task.done ? "✔" : "❌"}</button>
  //       <span class="taskText" data-id="${task.id}">${task.text}</span>

  //       <button class="delete-task" data-id="${task.id}">🗑️</button>
  //   `;
  //       configTask(div, tasks, task);
  //       taskListElement.appendChild(div);
  //     });

  //     break;

  //   case "done":
  //     const doneTasks = tasks.filter((task, id) => task.done);
  //     console.log("je rentre dans le cas done");

  //     doneTasks.forEach((task, id) => {
  //       const div = document.createElement("div");
  //       div.classList.add("task-item");

  //       if (task.done) div.classList.add("done");

  //       div.innerHTML = ` 
  //       <button class="toggle-task" data-id="${task.id}">✔</button>
  //       <span class="taskText">${task.text}</span>
  //       <button class="delete-task" data-id="${task.id}">🗑️</button>`;

  //       configTask(div);
  //       taskListElement.appendChild(div);
  //     });

  //     break;

  //   case "active":
  //     console.log("je rentre dans le cas active");

  //     const activeTasks = tasks.filter((task, id) => !task.done);
  //     console.log("je rentre dans le cas done");

  //     activeTasks.forEach((task, id) => {
  //       const div = document.createElement("div");
  //       div.classList.add("task-item");

  //       if (task.done) div.classList.add("done");

  //       div.innerHTML = ` 
  //       <button class="toggle-task" data-id="${task.id}">❌</button>
  //       <span class="taskText">${task.text}</span>
  //       <button class="delete-task" data-id="${task.id}">🗑️</button>
  //   `;
  //       configTask(div);
  //       taskListElement.appendChild(div);
  //     });

  //     break;
  // }

  updateCounter();
}

// Pour ajouter une tâche  ////
export function addTask(text) {
  const id = new Date().getTime();
  const tasks = loadTasks();
  tasks.push({ id, text, done: false });
  saveTasks(tasks);
}

// Pour supprimer une tâche  ////
export function deleteTask(id) {
  const tasks = loadTasks();
  const new_id = tasks.findIndex((t) => t.id === id);
  tasks.splice(new_id, 1);
  saveTasks(tasks);
}

///// Pour modifier le statut d'une tâche  ////
export function toggleTask(id) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.done = !task.done; // inversion
  }
  saveTasks(tasks);
}

// Mettre à jour un compteur de tâches  ////
export function updateCounter() {
  const tasks = loadTasks();

  const active = tasks.filter((t) => !t.done).length;
  const done = tasks.filter((t) => t.done).length;

  const counterElement = document.querySelector(".task-counter");
  counterElement.textContent = `${active} tâche(s) en cours et ${done} tâche(s) terminée(s)`;
}

// Mettre à jour l'édition d'une tâche  ///////////
export function editTask(id, newText) {
  const tasks = loadTasks();

  const findTask = tasks.find((task) => {
    return id === task.id;
  });

  console.log("ID de la tâche à modifier:  ", id);
  console.log("la valeur de findTask est: ", findTask);
  console.log("mon tableau de tâches vaut: ", tasks);

  if (findTask) {
    findTask.text = newText;
  }
  saveTasks(tasks);
}

//// Configuration des tâches //////////////////
function configTask(htmlElmnt, taskArray, taskUnit, onDropComplete) {
  htmlElmnt.setAttribute("draggable", "true");
  htmlElmnt.dataset.id = taskUnit.id;

  htmlElmnt.addEventListener("dragstart", () => {
    currentDraggedId = taskUnit.id;
  });

  htmlElmnt.addEventListener("dragover", (evt) => {
    evt.preventDefault();
    currentDraggedOverId = Number(htmlElmnt.dataset.id);
    htmlElmnt.classList.add("drag-over");
  });

  htmlElmnt.addEventListener("dragleave", () => {
    htmlElmnt.classList.remove("drag-over");
  });

  htmlElmnt.addEventListener("drop", (evt) => {
    evt.preventDefault();
    htmlElmnt.classList.remove("drag-over");

    if (
      currentDraggedId === null ||
      currentDraggedId === currentDraggedOverId
    ) {
      return;
    }

    const fromIndex = taskArray.findIndex(
      task => task.id === currentDraggedId
    );

    const toIndex = taskArray.findIndex(
      task => task.id === currentDraggedOverId
    );

    if (fromIndex === -1 || toIndex === -1) return;

    arrayReorganization(fromIndex, toIndex, taskArray);

    // 🔥 ICI : on informe le contrôleur
    onDropComplete();
  });
}


/////////// Réorganisation du tableau de tâches  ////////////
function arrayReorganization(fromIndex, toIndex, array) {
  const [draggedTask] = array.splice(fromIndex, 1);
  array.splice(toIndex, 0, draggedTask);
  saveTasks(array);
}

