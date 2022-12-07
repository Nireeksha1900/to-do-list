let listData = JSON.parse(localStorage.getItem("data") || "[]");
let finishedTask = JSON.parse(localStorage.getItem("dataA") || "[]");

//adding new task
window.onload = function () {
    //prepopulate the stored lists
    listData.forEach((element, index) => {
        addTask(element);
        taskProgress()
    });

    document.getElementById("addtask-form").onsubmit = function (e) {
        var inputValue = document.getElementById("adf-input").value;

        if (inputValue.trim() === "") {
            alert("write something");
            return false;
        }

        //prepare the data
        let dt = {};
        dt["id"] = listData.length + 1;
        dt["name"] = inputValue;
        dt["status"] = 0;

        //update the stored data
        updateLocalStorage(dt, "add");

        //add task
        addTask(dt);

        return false;
    };
};

var addTask = function (rowData) {
    var list = document.querySelector(".list-group.list-group-flush");
    //handle visibility of actions
    document.getElementById("progress").style.display = "block"
    document.getElementById("navbar").style.display = "block";
    document.getElementById("progressPercent").style.display="block"
    document.getElementById("listbodyh").style.display = "none";
    document.getElementById("listbodyp").style.display = "none";

    let li = document.createElement("li");
    li.className = "list-group-item p-2 m-2 rounded";

    var inputCheck = document.createElement("input");
    inputCheck.type = "checkbox";

    inputCheck.setAttribute("data-id", rowData.id);
    if (rowData.status) {
        inputCheck.setAttribute("checked", "true");
    }

    inputCheck.className = "form-check-input checked-focus me-2";
   // taskProgress();
    inputCheck.addEventListener("change", function () {
        taskProgress()
        if (inputCheck.checked) {
            txtLabel.removeAttribute("contentEditable");
        } else {
            txtLabel.contentEditable = true;
        }
        updateLocalStorage(null, "status_update", this.getAttribute("data-id"), inputCheck.checked ? "1" : "0");
    });

    var txtLabel = document.createElement("label");
    txtLabel.className = "form-label";
    txtLabel.innerHTML = rowData.name;
    if (!rowData.status) {
        txtLabel.contentEditable = true;
    }
    txtLabel.setAttribute("data-id", rowData.id);
    ["keydown"].forEach((evt) =>
        txtLabel.addEventListener(evt, function (e) {
            if (e.keyCode == 13) {
                e.preventDefault()
                updateLocalStorage(null, "edit", this.getAttribute("data-id"), this.innerText);
            } else {
                return false
            }

        })
    );
    li.appendChild(inputCheck);
    li.appendChild(txtLabel);
    list.appendChild(li);

    //clear the input
    document.getElementById("adf-input").value = "";
    return true;
};

var updateLocalStorage = (data, action, dataId, newValue) => {
    if (action == "add") {
        //Add into localStorage
        listData.push(data);
        localStorage.setItem("data", JSON.stringify(listData));
    }

    /* if (action == "remove") {
        var index = listData.findIndex((dt) => dt.name === value);
        listData.splice(index, 1);
        localStorage.setItem("data", JSON.stringify(listData));
    } */

    if (action == "status_update" || action == "edit") {
        //console.log("newValue", newValue);
        listData.map(function (value, index, array) {
            if (value.id == dataId) {
                if (action == "status_update") {
                    value.status = parseInt(newValue);
                }
                if (action == "edit") {
                    value.name = newValue;
                }
            }
            return array;
        });
        localStorage.setItem("data", JSON.stringify(listData));
    }

    if (action == "clear") {
        localStorage.clear();
    }
};

//progress bar
function taskProgress() {

    var tasks = document.querySelector(".list-group");
    var checkedBox = tasks.querySelectorAll("input[type='checkbox']:checked");
    var progressBar = document.querySelector(".progress-bar")
    var checked = checkedBox.length
   var checkbox = document.querySelectorAll("input[type='checkbox']");
    var check = checkbox.length 
    progressBar.style.width = ((checked / check) * 100 )+ "%";
    //progressBar.innerHTML = ((checked / 5) * 50) / 10 + " task done";
   document.getElementById("progressPercent").innerHTML=Math.trunc(((checked / check) * 100 ))+ "%";
};


//clearall
var clearBtn = document.getElementById("clearButton");
clearBtn.addEventListener("click", function () {
    listData.length = 0;
    document.querySelector(".list-group").innerHTML = "";
    document.querySelector(".progress-bar").style.width = "0%";
    localStorage.clear();
    document.getElementById("progress").style.display = "none";
    document.getElementById("navbar").style.display = "none";
    document.getElementById("listbodyh").style.display = "block";
    document.getElementById("listbodyp").style.display = "block";
    document.getElementById("progressPercent").style.display="none"
});
