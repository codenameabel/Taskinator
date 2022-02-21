var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function (event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // CHECK IF INPUT VALUES ARE EMPTY STRINGS
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // RESETS THE FORM 
    formEl.reset();

    // CHECKING TO SEE IF ELEMENT HAS DATA-TASK-ID ID
    var isEdit = formEl.hasAttribute("data-task-id");

    // HAS DATA ATTRIBUTE, SO GET TASK ID AND CALL FUNCTION TO COMPLETE EDIT PROCESS
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // NO DATA ATTRIBUTE, SO CREATE OBJECT AS NORMAL AND PASS TO createTaskEl FUNCTION
    else {
        // PACKAGE UP DATA AS AN OBJECT
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };

        // SEND IT AS AN ARGUMENT TO createTaskEl 
        createTaskEl(taskDataObj);
    }
};

var completeEditTask = function (taskName, taskType, taskId) {
    // FIND THE MATCHING TASK LIST ITEM
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // SET NEW VALUES 
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function (taskDataObj) {
    // CREATES LIST ITEM WITH CSS STYLE
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // CREATES TASK ID AS A CUSTOM ATTRIBUTE
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // DECLARES taskInfoEl AS A VARIABLE THEN CREATES A DIV FOR IT
    var taskInfoEl = document.createElement("div");
    // GIVES IT A CLASS NAME 
    taskInfoEl.className = "task-info";
    // ADD HTML CONTENT TO DIV AND ADDS CSS TO HTML THEN APPPENDS taskInfoEl to listItemEl
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "<h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // TAKES createTaskAction() AND PASSES taskIdCounter() INTO IT THEN CREATES taskActionsEl
    var taskActionsEl = createTaskActions(taskIdCounter);
    // TAKES taskActionsEl AND APPENDS TO listItemEl
    listItemEl.appendChild(taskActionsEl);

    // ADD ENTIRE LIST ITEM TO LIST
    tasksToDoEl.appendChild(listItemEl);

    // INCREASE TASK COUNTER FOR NEXT UNIQUE ID
    taskIdCounter++;
};

var createTaskActions = function (taskId) {
    // CREATES NEW DIV AND GIVES IT A CLASS NAME OF "task-actions" FOR CSS STYLE
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // CREATES EDIT BUTTON ELEMENT
    var editButtonEl = document.createElement("button");
    // ADDS TEXT TO BUTTON
    editButtonEl.textContent = "Edit";
    // GIVES EDIT BUTTON A CLASS NAME
    editButtonEl.className = "btn edit-btn";
    // GIVES listEl ID OF CORRESPONDING DELETE BUTTON
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // CREATES DELETE BUTTON ELEMENT 
    var deleteButtonEl = document.createElement("button");
    // GIVES DELETE BUTTON TEXT
    deleteButtonEl.textContent = "Delete";
    // ASSIGNS BUTTON A CLASS NAME
    deleteButtonEl.className = "btn delete-btn";
    // GIVES listEl ID OF CORRESPONDING DELETE BUTTON
    deleteButtonEl.setAttribute("data-task-id", taskId);
    // APPENDS DELETE BUTTON TO ACTION CONTAINER ELEMENT
    actionContainerEl.appendChild(deleteButtonEl);

    // CREATES THE SELECT ELEMENT
    var statusSelectEl = document.createElement("select");
    // GIVES SELECT ELEMENT A CLASS NAME 
    statusSelectEl.className = "select-status";
    // 
    statusSelectEl.setAttribute("name", "status-change");
    // GIVES SELECT ELEMENT ID CORRESPONDING TO SELECT ELEMENT
    statusSelectEl.setAttribute("data-task-id", taskId);

    // CREATES THE ARRAY FOR CHOICES FOR THE SELECT ELEMENT 
    var statusChoices = ["To Do", "In Progress", "Completed"];

    // FOR-LOOP TO CREATE THE CHOICES FOR statusSelectEl
    for (var i = 0; i < statusChoices.length; i++) {
        // CREATE OPTION ELEMENT
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // APPEND TO SELECT ELEMENT
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

var taskButtonHandler = function (event) {
    // GET TARGET ELEMENT FROM EVENT
    var targetEl = event.target;

    // EDIT BUTTON WAS CLICKED 
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // DELETE BUTTON WAS CLICKED
    else if (targetEl.matches(".delete-btn")) {
        // GET THE ELEMENT'S TASK ID WHEN CLICKED
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

// FUNCTION FOR DELETE BUTTON TO READ LIST ITEM BY ID THEN TO REMOVE IT
var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

var editTask = function (taskId) {
    // console.log("editing task #" + taskId);

    // GET TASK LIST ITEM ELEMENT
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // GET CONTENT FROM TASK NAME AND TYPE
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // console.log(taskName);
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // console.log(taskType);

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

// FUNCTION FOR HANDLING WHAT TASK COLUMN LIST ELEMENT BELONGS TO
var taskStatusChangeHandler = function() {
    // GET THE TASK ITEM'S ID
    var taskId = event.target.getAttribute("data-task-id");
    // GET THE CURRENTLY SELECTED OPTION'S VALUE AND CONVERT TO LOWERCASE
    var statusValue = event.target.value.toLowerCase();
    // FIND THE PARENT TASK ITEM ELEMENT BASED ON THE ID
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") { 
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
};

pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);