// localstorage item key
let dbName = "issueDB";


// dom element references
const issueDescription = document.getElementById("description");
const issueSeverity = document.getElementById("severity");
const issueAssignedTo = document.getElementById("assigned-to");
const addBtn = document.getElementById("add");
const showIssuesDiv = document.getElementById("show-issues");


// resets the text input fields
function resetIssueInput() {
  issueDescription.value = "";
  issueAssignedTo.value = "";
}

// checks if the user input is valid and returns string "ok" or error message otherwise
function checkIssue(issue) {
  let msg = "ok";
  if (issue.description === "") msg = "Please describe your issue.";
  if (issue.description.length > 250 || issue.description.length < 3)
    msg = "Issue description must be between 3 and 250 characters long.";
  if (issue.assignedTo === "") msg = "Please type an asignee name.";
  return msg;
}
// generated unique uid
function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// runs when user adds an issue
function addIssue() {
  let issue = {
    id: generateUID(),
    description: "",
    severity: "Low",
    assignedTo: "",
    status: "open",
  };
  issue.description = issueDescription.value;
  issue.severity = issueSeverity.value;
  issue.assignedTo = issueAssignedTo.value;

  let checkResult = checkIssue(issue);
  if (checkResult === "ok") {
    saveToLocalStorage(issue);
    resetIssueInput();
    let element = createIssueElement(issue);
    showIssuesDiv.prepend(element);
  } else {
    alert(checkResult);
  }
}
// stores the issue to localstorage
function saveToLocalStorage(issue) {
  let issuesList = localStorage.getItem(dbName);
  if (issuesList === null) {
    let newIssuesList = [issue];
    localStorage.setItem(dbName, JSON.stringify(newIssuesList));
  } else {
    let issuesListArray = JSON.parse(issuesList);
    issuesListArray.push(issue);
    localStorage.setItem(dbName, JSON.stringify(issuesListArray));
  }
}

// fetches all the issues in localstorages and shows in html
function showIssues() {
  let issuesList = localStorage.getItem(dbName);
  if (issuesList == null) return;
  let issuesListArray = JSON.parse(issuesList);

  for(let i = issuesListArray.length - 1; i >=0 ; i--) {
    let issue = issuesListArray[i];
    let element = createIssueElement(issue);
    showIssuesDiv.append(element);
  };
}

// creates and returns an issue dom element with all the styles
function createIssueElement(issue) {
  let wrapperDiv = document.createElement("div");
  let idDiv = document.createElement("div");
  let statusButton = document.createElement("button");
  let descriptionDiv = document.createElement("div");
  let severityDiv = document.createElement("div");
  let assigendToDiv = document.createElement("div");
  let closeButton = document.createElement("button");
  let deleteButton = document.createElement("button");

  wrapperDiv.setAttribute("class", "wrapper container");
  statusButton.setAttribute("class", "btn btn-info btn-sm");
  descriptionDiv.setAttribute("class", "description");
  closeButton.setAttribute("class", "btn btn-warning margin-10");
  closeButton.setAttribute("onclick", `closeIssue("${issue.id}");`);
  deleteButton.setAttribute("class", "btn btn-danger margin-10");
  deleteButton.setAttribute("onclick", `deleteIssue("${issue.id}");`);

  idDiv.innerText = "ID: " + issue.id;
  statusButton.innerText = issue.status;
  descriptionDiv.innerText = issue.description;
  severityDiv.innerText = issue.severity;
  assigendToDiv.innerText = issue.assignedTo;
  closeButton.innerText = "Close";
  deleteButton.innerText = "Delete";
  wrapperDiv.append(idDiv);
  wrapperDiv.append(statusButton);
  wrapperDiv.append(descriptionDiv);
  wrapperDiv.append(severityDiv);
  wrapperDiv.append(assigendToDiv);
  wrapperDiv.append(closeButton);
  wrapperDiv.append(deleteButton);
  return wrapperDiv;
}

// updates a single issue element
function updateIssueElement(issueID) {

}
// function deleteIssue(id) {
//   let issuesList = localStorage.getItem(dbName);
//   if (issuesList == null) return;
//   let issuesListArray = JSON.parse(issuesList);
//   for(let i = 0; i < issuesListArray.length; i++) {

//   }
//   localStorage.setItem(dbName, JSON.stringify(issuesListArray));
// }

addBtn.addEventListener("click", addIssue);
showIssues();
