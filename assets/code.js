//SELECT ELEMENTS AND ASSIGN THEM TO VARS
var newTask = document.querySelector('#new-task');
var addTaskBtn = document.querySelector('#addTask');

var toDoUl = document.querySelector(".todo-list ul");
var completeUl = document.querySelector(".complete-list ul");

$(document).ready(function() {
    $("#addTask").on('click', function(e) {

        addTask()
    })

    // fetch Incomplete task
    fetch('../api/getInComplete', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        }).then(res => res.json()).then(data => {


            for (var i = 0; i < data.length; i++) {
                // console.log(data[i].record)
                var listItem = fetchIncompleteTask(data[i].record, data[i]._id)
                toDoUl.append(listItem)
                bindIncompleteItems(listItem, completeTask);

            }
        })
        //EVERYTHING PUT TOGETHER


    // fetch complete task
    fetch('../api/getComplete', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
    }).then(res => res.json()).then(data => {


        for (var i = 0; i < data.length; i++) {
            // console.log(data[i].record)
            fetchCompletedTask(data[i].record, data[i]._id)


        }
    })



})



// Fetch Incomeplete Task
var fetchIncompleteTask = function(task, id) {

    //SET UP THE NEW LIST ITEM
    var listItem = document.createElement("li"); //<li>
    var checkBox = document.createElement("input"); //checkbox
    var label = document.createElement("label"); // <label>

    checkBox.setAttribute('class', 'listId');
    checkBox.setAttribute('attr', id);

    //CREATE AND INSERT THE DELETE BUTTON
    var editBtn = document.createElement("button"); // <button>
    editBtn.innerText = "Edit";
    editBtn.className = "edit";
    editBtn.setAttribute('attr', id)
    editBtn.setAttribute('attr2', task)
        // editBtn.onclick = editItem(task[0], id[0])

    //PULL THE INPUTED TEXT INTO LABEL
    label.innerText = task;

    //ADD PROPERTIES
    checkBox.type = "checkbox";

    //ADD ITEMS TO THE LI
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.append("                  ");
    listItem.appendChild(editBtn);

    return listItem;

};

// fetch completed tasks

var fetchCompletedTask = function(task, id) {
    //GRAB THE CHECKBOX'S PARENT ELEMENT, THE LI IT'S IN
    var listItem = document.createElement("li"); //<li>
    var label = document.createElement("label"); // <label>

    label.innerText = task;
    listItem.appendChild(label);

    //CREATE AND INSERT THE DELETE BUTTON
    var deleteBtn = document.createElement("button"); // <button>
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete";
    deleteBtn.setAttribute('attr', id)

    listItem.appendChild(deleteBtn);

    //PLACE IT INSIDE THE COMPLETED LIST
    completeUl.appendChild(listItem);

    //BIND THE NEW COMPLETED LIST
    bindCompleteItems(listItem, deleteTask);
}

// end fetch incomplete tasks

// edit task
$(document).on('click', '.edit', function(e) {
        var id = $(this).attr('attr');
        var task = $(this).attr('attr2');

        $(".edit-task").val(task);
        $(".editTask").val(id);

        $("#edit").css('display', 'block');


    })
    // edit button submitted
$(".editTask").on('click', function(e) {
    var record = $(".edit-task").val();
    var id = $(this).val();

    fetch('../api/update', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            record: record
        })

    }).then(res => res.json()).then(data => {
        console.log(data)
        if (data == "success") {
            toDoUl.innerHTML = "";
            $("#edit").css('display', 'none');

            fetch('../api/getInComplete', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
            }).then(res => res.json()).then(data => {


                for (var i = 0; i < data.length; i++) {
                    // console.log(data[i].record)
                    var listItem = fetchIncompleteTask(data[i].record, data[i]._id)
                    toDoUl.append(listItem)
                    bindIncompleteItems(listItem, completeTask);

                }
            })

        }
    })


})


// end edit task

//CREATE FUNCTIONS
//CREATING THE ACTUAL TASK LIST ITEM
var createNewTask = function(task) {
    console.log("Creating task...");

    //SET UP THE NEW LIST ITEM
    var listItem = document.createElement("li"); //<li>
    var checkBox = document.createElement("input"); //checkbox
    var label = document.createElement("label"); // <label>


    //PULL THE INPUTED TEXT INTO LABEL
    label.innerText = task;

    //ADD PROPERTIES
    checkBox.type = "checkbox";

    //ADD ITEMS TO THE LI
    listItem.appendChild(checkBox);
    listItem.appendChild(label);


    fetch('../api/create', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                record: task
            })

        }).then(res => res.json()).then(data => {
            console.log(data)
        })
        //EVERYTHING PUT TOGETHER
    return listItem;

};

//ADD THE NEW TASK INTO ACTUAL INCOMPLETE LIST
var addTask = function() {
    console.log("Adding task...");
    //FOR CLARITY, GRAB THE INPUTTED TEXT AND STORE IT IN A VAR
    var listItem = createNewTask(newTask.value);
    //ADD THE NEW LIST ITEM TO LIST
    toDoUl.appendChild(listItem);
    //CLEAR THE INPUT
    newTask.value = "";

    //BIND THE NEW LIST ITEM TO THE INCOMPLETE LIST
    bindIncompleteItems(listItem, completeTask);

};

var completeTask = function() {

    //GRAB THE CHECKBOX'S PARENT ELEMENT, THE LI IT'S IN
    var listItem = this.parentNode;




    //SELECT THE CHECKBOX FROM THE COMPLETED CHECKBOX AND REMOVE IT
    var checkBox = listItem.querySelector("input[type=checkbox]");
    var id = checkBox.getAttribute('attr');

    var editBtn = listItem.querySelector("button");

    fetch('../api/makeComplete', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                _id: id
            })

        }).then(res => res.json()).then(data => {
            console.log(data)
        })
        //EVERYTHING PUT TOGETHER
    checkBox.remove();
    editBtn.remove();

    //CREATE AND INSERT THE DELETE BUTTON
    var deleteBtn = document.createElement("button"); // <button>
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete";
    deleteBtn.setAttribute('attr', id)
    listItem.appendChild(deleteBtn);

    //PLACE IT INSIDE THE COMPLETED LIST
    completeUl.appendChild(listItem);

    //BIND THE NEW COMPLETED LIST
    bindCompleteItems(listItem, deleteTask);

};

//DELETE TASK FUNCTIONS
var deleteTask = function() {
    console.log("Deleting task...");

    var listItem = this.parentNode;
    var button = listItem.querySelector("button");
    var id = button.getAttribute('attr');



    fetch('../api/deleteItem', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            _id: id
        })

    }).then(res => res.json()).then(data => {
        console.log(data)
    })


    var ul = listItem.parentNode;

    ul.removeChild(listItem);

};

//A FUNCTION THAT BINDS EACH OF THE ELEMENTS THE INCOMPLETE LIST

var bindIncompleteItems = function(taskItem, checkBoxClick) {
    console.log("Binding the incomplete list...");

    //BIND THE CHECKBOX TO A VAR
    var checkBox = taskItem.querySelector("input[type=checkbox]");

    //SETUP EVENT LISTENER FOR THE CHECKBOX
    checkBox.onchange = checkBoxClick;
};


//A FUNCTIONM THAT BINDS EACH OF THE ELEMTS IN THE COMPLETE LIST
var bindCompleteItems = function(taskItem, deleteButtonPress) {
    console.log("Binding the complete list...");



    //BIND THE DELETE BUTTON
    var deleteButton = taskItem.querySelector(".delete");

    //WHEN THE DELETE BUTTIN IS PRESSED, RUN THE deleteTask function
    deleteButton.onclick = deleteButtonPress;

};


for (var i = 0; i < toDoUl.children.length; i++) {
    bindIncompleteItems(toDoUl.children[i], completeTask);
}

for (var i = 0; i < completeUl.children.length; i++) {
    bindCompleteItems(completeUl.children[i], deleteTask);
}


// addTaskBtn.addEventListener("click", addTask);