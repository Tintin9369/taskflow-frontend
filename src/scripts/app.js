// ===============================
// TaskFlow - app.js
// ===============================
export { refreshUI };
import { openModal, closeModal } from "./components/taskModal.js";
// import { saveTasks, loadTasks } from "./utils/storage";
import {
  renderTasks,
  addTask,
  deleteTask,
  toggleTask,
  editTask  
} from "./components/taskList.js";

let currentFilter = "all";

function refreshUI() {
  renderTasks(currentFilter);
}

function init() {
  console.log("hello");

  // afficher les tâches
  renderTasks();

  document.querySelector(".add-task_Btn").addEventListener("click", openModal);

  document.querySelector(".cancel").addEventListener("click", closeModal);

  document.querySelector(".addNewTask").addEventListener("submit", (event) => {
    event.preventDefault();

    const text = document.querySelector("#newTask").value;
    addTask(text);
    document.querySelector("#newTask").value = "";
    closeModal();
    renderTasks();
    console.log(text);
  });

  const toggleBtn = document.querySelector(".theme-toggle");

  toggleBtn.addEventListener("click", () => {
    //passer en mode sombre
    document.documentElement.classList.toggle("dark");
  });

  document.querySelector(".task-list").addEventListener("click", (evt) => {
    // 1. Suppression d'une tâche
    if (evt.target.classList.contains("delete-task")) {
      const id = Number(evt.target.dataset.id);

      const div = evt.target.closest(".task-item");

      // animation CSS
      div.classList.add("remove");

      setTimeout(() => {
        deleteTask(id);
        renderTasks();
      }, 250);
    }

    // 2. Toggle done
    if (evt.target.classList.contains("toggle-task")) {
      const id = Number(evt.target.dataset.id);
      toggleTask(id);

      renderTasks();
    }
  });

  // Le User clique sur un des boutons de filtre  //////
  document.querySelector(".task-filter").addEventListener("click", (evt) => {
    // Filtre all //
    if (evt.target.classList.contains("btn_all")) {
      currentFilter = "all";
      refreshUI();
    }

    ///// filtre tâches actives  /////////////
    if (evt.target.classList.contains("btn_active")) {
      currentFilter = "active";
      refreshUI();
    }

    // filtre tâches déjà réalisées  ////////
    if (evt.target.classList.contains("btn_done")) {
      currentFilter = "done";
      refreshUI();
    }
  });

  //// le User clique pour modifier le contenu d'une tâche
  document.querySelector(".task-list").addEventListener("dblclick", (evt) => {
    if (evt.target.classList.contains("taskText")) {
      console.log("j'ai double-cliqué sur une tâche");

      const id = Number(evt.target.dataset.id);
      console.log("ID récupéré :", id);

      const currentSpan = evt.target;

      const newInput = document.createElement("input");
      newInput.classList.add("task-edit");
      newInput.type = "text";
      newInput.value = currentSpan.textContent;

      currentSpan.replaceWith(newInput);
      newInput.focus();
      newInput.select();

      let enterPressed = false;

      newInput.addEventListener("blur", () => {
        if (enterPressed === false) {
          console.log("suis passé par le blur");
          const textValue = newInput.value;
          editTask(id, textValue);
          renderTasks();
        }
      });

      newInput.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
          evt.preventDefault();
          console.log("touche Enter a été appuyée");
          console.log("newInput existe ? ", newInput);
          enterPressed = true;
          const textValue = newInput.value;
          console.log("le contenu de la nouvelle tâche vaut:  ", textValue);
          editTask(id, textValue);
          renderTasks();
        }
      });
    }
  });
}

init();
