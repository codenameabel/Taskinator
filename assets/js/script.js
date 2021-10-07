var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;

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

    // PACKAGE UP DATA AS AN OBJECT
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // SEND IT AS AN ARGUMENT TO createTaskEl 
    createTaskEl(taskDataObj);
};

var createTaskEl = function (taskDataObj) {
    // CREATE LIST ITEM
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // ADD TASK ID AS A CUSTOM ATTRIBUTE
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // CREATE DIV TO HOLD TASK INFO AND ADD TO LIST ITEM
    var taskInfoEl = document.createElement("div");
    // GIVE IT A CLASS NAME 
    taskInfoEl.className = "task-info";
    // ADD HTML CONTENT TO DIV 
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "<h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // TAKES createTaskAction() AND PASSES taskIdCounter()
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // ADD ENTIRE LIST ITEM TO LIST
    tasksToDoEl.appendChild(listItemEl);

    // INCREASE TASK COUNTER FOR NEXT UNIQUE ID
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    // CREATES NEW DIV AND GIVES IT A CLASS NAME OF "task-actions"
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions"; 

    // CREATE EDIT BUTTON
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // CREATE DELETE BUTTON 
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent= "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute ("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // CREATES THE SELECT ELEMENT
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    // CREATES THE ARRAY FOR CHOICES FOR THE SELECT ELEMENT 
    var statusChoices = ["To Do", "In Progress", "Completed"];
    
    // FOR LOOP TO CREATE ALL CHOICES FOR SELECT ELEMENT 
    for (var i = 0; i < statusChoices.length; i++) {
        // CREATE OPTION ELEMENT
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // APPEND TO SELECT
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);
