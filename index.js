import "core-js/stable";
import "regenerator-runtime/runtime";

const inputField = document.querySelector(".input-field");
const submitBtn = document.querySelector(".task-btn");
const tasksContainer = document.querySelector(".tasks-container");
const clearButton = document.querySelector(".clear-all-btn");
const modeBtn = document.querySelector(".mode-button");
const body = document.querySelector("body");

let tasks;
let screenMode;

const handleScreenMode = function (state) {
  if (state === "light") {
    body.classList.remove("dark-mode");
    modeBtn.name = "sunny-outline";
  } else {
    body.classList.add("dark-mode");
    modeBtn.name = "moon-outline";
  }
};

const renderTask = function (checked, id, label) {
  let html = `<div class="task" data-id=${id}>
          <div class="task-and-box">
            <input type="checkbox" class="task-checkbox" id="chckbox-${id}" data-id=${id} ${checked ? "checked" : ""}/>
            <label for="chckbox-${id}" class="task-label ${checked ? "crossed" : ""}">${label}</label>
          </div>
          <button class="complete-task-btn" data-id=${id}>𐄂</button>
        </div>`;
  tasksContainer.insertAdjacentHTML("afterbegin", html);
};

const completeTask = function (e) {
  e.target.nextElementSibling.classList.toggle("crossed");
  const completedTask = tasks.find((task) => task.id === e.target.dataset.id);
  if (completedTask.checked) {
    completedTask.checked = false;
  } else {
    completedTask.checked = true;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const removeTask = function (e) {
  e.target.closest(".task").remove();
  const finishedTask = tasks.find((task) => task.id === e.target.dataset.id);
  tasks = tasks.filter((task) => task !== finishedTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const handleButtons = function () {
  const boxes = document.querySelectorAll(".task-checkbox");
  const closes = document.querySelectorAll(".complete-task-btn");
  if (boxes.length === 0) {
    return;
  }
  for (const box of boxes) {
    box.addEventListener("change", completeTask);
  }
  for (const close of closes) {
    close.addEventListener("click", removeTask);
  }
};

const init = function () {
  if (JSON.parse(localStorage.getItem("tasks"))) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(function (task) {
      renderTask(task.checked, task.id, task.label);
      handleButtons();
    });
  } else {
    tasks = [];
  }
  if (localStorage.getItem("mode")) {
    handleScreenMode(localStorage.getItem("mode"));
  }
};

init();

class Task {
  constructor(checked, label, id) {
    ((this.checked = checked), (this.label = label), (this.id = id));
  }
}

const createTask = function () {
  if (!inputField.value) {
    return;
  }
  let id = String(Date.now()).slice(-4);
  let label = inputField.value;
  let checked = false;
  renderTask(checked, id, label);
  const taskObj = new Task(checked, inputField.value, id);
  tasks.push(taskObj);
  inputField.value = "";
  localStorage.setItem("tasks", JSON.stringify(tasks));
  handleButtons();
};

const clearCompleted = function () {
  tasksContainer.innerHTML = "";
  tasks = tasks.filter((task) => task.checked === false);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  init();
};

const modeChange = function () {
  body.classList.toggle("dark-mode");
  modeBtn.name =
    modeBtn.name === "sunny-outline" ? "moon-outline" : "sunny-outline";
  screenMode = modeBtn.name === "sunny-outline" ? "light" : "dark";
  localStorage.setItem("mode", screenMode);
};

modeBtn.addEventListener("click", modeChange);
clearButton.addEventListener("click", clearCompleted);
submitBtn.addEventListener("click", createTask);
