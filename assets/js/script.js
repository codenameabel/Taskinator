var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// VARIABLE THAT HOLDS ARRAY OF TASKS
var tasks = [];

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
            type: taskTypeInput,
            status: "to do"
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

    // LOOP TRHOUGH TASKS ARRAY AND TASK OBJECT WITH NEW CONTENT
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
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

    // ADDING ID VALUE OF TASK AS A PROPERTY TO taskDataObj
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    // INCREASE TASK COUNTER FOR NEXT UNIQUE ID
    taskIdCounter++;

    saveTasks();
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

    // CREATE NEW ARRAY TO HOLD UPDATED LIST OF TASKS
    var updatedTaskArr = [];
    // LOOP THROUGH CURRENT TASKS
    for (i = 0; i < tasks.length; i++) {
        // IF tasks[i].id DOESN'T MATCH THE VALUE OF taskId, LETS KEEP THAT TASK AND PUSH IT TO THE NEW ARRAY
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // REASSIGN TASKS ARRAY TO BE THE SAME AS updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
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
var taskStatusChangeHandler = function () {
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

    // UPDATES TASK'S IN TASK ARRAY
    for (i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

// SAVES DATA TO LOCAL STORAGE
var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// 1. GETS TASK ITEMS FROM localStorage
// 2. CONVERTS TAKS FROM STRING FORMAT BACK INTO ARRAY OF OBJECTS
// 3. ITERATES THROUGH A TASKS ARRAY AND CREATES TASK ELEMENTS ON THE PAGE FROM IT.
var loadTasks = function () {

    // RETRIEVES TASKS FROM localStorage
    var savedTasks = localStorage.getItem("tasks");

    // CHECKS IF STRING RETURNS AS NULL
    if (!savedTasks) {
        return false;
    }

    // TURNS STRING OF DATA FROM localStorage TO ARRAY OF OBJECTS
    savedTasks = JSON.parse(savedTasks);

    // LOOP THROUGH savedTasks ARRAY
    for (var i = 0; i < savedTasks.length; i++) {
        // PASS EACH TASK OBJECT INTO THE createTaskEl FUNCTION
        createTaskEl(savedTasks[i]);
    }
};

loadTasks();

pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);