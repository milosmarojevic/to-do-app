import "core-js/stable";
import "regenerator-runtime/runtime";

// prettier-ignore
const months = [
  "January","February","March","April","May","June","July","August","September","October","November","December",
];
// prettier-ignore
const weekdays = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
];

/*Selections*/
const dateText = document.querySelector(".top-date");
const inputField = document.querySelector(".input-field");
const submitBtn = document.querySelector(".form-btn");
const taskForm = document.querySelector(".task-form");
const tasksContainer = document.querySelector(".tasks-div .inner");
const allButton = document.querySelector(".all-btn");
const activeButton = document.querySelector(".active-btn");
const completedButton = document.querySelector(".completed-btn");
const sortingBtns = document.querySelectorAll(".sorting-btn");
const tasksNumber = document.querySelector(".tasks-number-info span");
const clearBtn = document.querySelector(".clear-btn");
const emptyDiv = document.querySelector(".empty-tasks-div");

const app = function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  /*Sorting and rendering*/

  const renderHTML = function (task) {
    let html = `<div class="task ${task.status === "completed" ? "completed" : ""}">
                 <input type="checkbox" data-num="${task.id}"${task.status === "completed" ? "checked" : ""} class="checkbox" />
                 <p data-task="${task.id}" class="task-text">${task.taskText}</p>
              </div>`;
    tasksContainer.insertAdjacentHTML("beforeend", html);
  };

  const updateTaskNum = function (tasks) {
    tasksNumber.textContent = String(
      tasks.filter((task) => task.status === "active").length,
    );
  };

  const renderTasks = function (status) {
    tasksContainer.innerHTML = "";
    tasksNumber.textContent = "0";
    if (status === undefined) {
      tasks.forEach((task) => {
        renderHTML(task);
      });
      updateTaskNum(tasks);
      return;
    }
    tasks
      .filter((task) => task.status === status)
      .forEach((task) => {
        renderHTML(task);
      });
    updateTaskNum(tasks);
  };

  const updateUI = function (tasks) {
    if (tasks.length) {
      emptyDiv.classList.add("hidden");
      return;
    }
    emptyDiv.classList.remove("hidden");
  };

  renderTasks();
  updateUI(tasks);

  allButton.addEventListener("click", function (e) {
    sortingBtns.forEach((btn) => btn.classList.remove("sorting-btn-active"));
    e.target.classList.add("sorting-btn-active");
    renderTasks(undefined);
  });
  activeButton.addEventListener("click", function (e) {
    sortingBtns.forEach((btn) => btn.classList.remove("sorting-btn-active"));
    e.target.classList.add("sorting-btn-active");
    renderTasks("active");
  });
  completedButton.addEventListener("click", function (e) {
    sortingBtns.forEach((btn) => btn.classList.remove("sorting-btn-active"));
    e.target.classList.add("sorting-btn-active");
    renderTasks("completed");
  });

  /*Adding tasks*/
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let taskID = String(Date.now()).slice(-5);
    let newTask = { id: taskID, taskText: inputField.value, status: "active" };
    tasks.push(newTask);
    renderHTML(newTask);
    updateTaskNum(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateUI(tasks);
    inputField.value = "";
  });

  /*Completing the tasks*/
  tasksContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("checkbox")) return;
    e.target.closest(".task").classList.toggle("completed");
    const currentTask = tasks.find((task) => task.id === e.target.dataset.num);
    if (e.target.checked) {
      currentTask.status = "completed";
    }
    if (!e.target.checked) {
      currentTask.status = "active";
    }
    updateTaskNum(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });

  /*Clearing completed tasks*/
  clearBtn.addEventListener("click", function () {
    tasks = tasks.filter((task) => task.status === "active");

    [...document.querySelectorAll(".task")].forEach((task) => {
      if (task.classList.contains("completed")) task.remove();
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateUI(tasks);
    updateTaskNum(tasks);
  });

  /*Setting the date*/
  const setDate = function () {
    const date = new Date();
    dateText.textContent = `${weekdays[date.getDay() - 1]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };
  setDate();
};

app();
