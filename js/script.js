// localstorage item key
let dbName = "issueDB";

// dom element references
const issueDescription = document.getElementById("description");
const issueSeverity = document.getElementById("severity");
const issueAssignedTo = document.getElementById("assigned-to");
const addBtn = document.getElementById("add");
const showIssuesDiv = document.getElementById("show-issues");

// icons
const userIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`;
const timerIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;

let issueAutoDeleteDuration = 600000;

// autmatically deletes the issue after a certain period
function autoDelete(issueID) {
  setTimeout(() => {
    deleteIssue(issueID);
    removeIssueElement(issueID);
  }, issueAutoDeleteDuration);
}

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
    // automatically delete the issue after a duration
    autoDelete(issue.id);
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

// fetches all the issues in localstorages and shows the issue list. Only called in the first load
function showIssues() {
  let issuesList = localStorage.getItem(dbName);
  if (issuesList == null) return;
  let issuesListArray = JSON.parse(issuesList);

  for (let i = issuesListArray.length - 1; i >= 0; i--) {
    let issue = issuesListArray[i];
    let element = createIssueElement(issue);
    showIssuesDiv.append(element);
  }
}

// creates and returns an issue dom element with necessary children preconfigured
// Only handles the issue element rendering part. does not communicate with the localstorage at all
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
  // set the close button to call closeIssue function with issue id
  closeButton.setAttribute("onclick", `closeIssue("${issue.id}");`);
  deleteButton.setAttribute("class", "btn btn-danger margin-10");
  // set the delete button to call closeIssue function with issue id
  deleteButton.setAttribute("onclick", `deleteIssue("${issue.id}");`);

  idDiv.innerText = "ID: " + issue.id;
  statusButton.innerText = issue.status;
  descriptionDiv.innerText = issue.description;
  severityDiv.innerHTML = timerIcon + issue.severity;
  assigendToDiv.innerHTML = userIcon + issue.assignedTo;
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

// updates the content of a single issue dom element when the localstorage data has changed
function updateIssueElement(issueID) {
  let issuesList = localStorage.getItem(dbName);
  if (issuesList == null) return;
  let issuesListArray = JSON.parse(issuesList);
  let issue = null;
  for (let i = 0; i < issuesListArray.length; i++) {
    if (issuesListArray[i].id == issueID) {
      issue = issuesListArray[i];
      break;
    }
  }
  for (let i = 0; i < showIssuesDiv.children.length; i++) {
    let issueElementWrapper = showIssuesDiv.children[i];
    let issueElementIdNode = issueElementWrapper.children[0];
    let issueElementIdString = issueElementIdNode.innerText.slice(4);
    if (issueElementIdString == issueID) {
      let issueElementStatusNode = issueElementWrapper.children[1];
      let issueElementDescriptionNode = issueElementWrapper.children[2];
      let issueElementSeverityNode = issueElementWrapper.children[3];
      let issueElementAssignedToNode = issueElementWrapper.children[4];
      issueElementStatusNode.innerText = issue.status;
      issueElementDescriptionNode.innerText = issue.description;
      issueElementSeverityNode.innerHTML = timerIcon + issue.severity;
      issueElementAssignedToNode.innerHTML = userIcon + issue.assignedTo;
      break;
    }
  }
}

// removes an issue dom element from view
function removeIssueElement(issueID) {
  for (let i = 0; i < showIssuesDiv.children.length; i++) {
    let issueElementWrapper = showIssuesDiv.children[i];
    let issueElementIdNode = issueElementWrapper.children[0];
    let issueElementIdString = issueElementIdNode.innerText.slice(4);
    if (issueElementIdString == issueID) {
      issueElementWrapper.remove();
      break;
    }
  }
}

// deletes an issue from localstorage and calls the removeIssueElement to reflect the changes
function deleteIssue(issueID) {
  let issuesList = localStorage.getItem(dbName);
  if (issuesList == null) return;
  let issuesListArray = JSON.parse(issuesList);
  let issueIndex = -1;
  for (let i = 0; i < issuesListArray.length; i++) {
    if (issuesListArray[i].id == issueID) {
      issueIndex = i;
      break;
    }
  }
  if (issueIndex == -1) return;
  issuesListArray.splice(issueIndex, 1);
  localStorage.setItem(dbName, JSON.stringify(issuesListArray));
  removeIssueElement(issueID);
}

// sets the issue status to closed in localstorage and calls the update function to render the changes
function closeIssue(issueID) {
  let issuesList = localStorage.getItem(dbName);
  if (issuesList == null) return;
  let issuesListArray = JSON.parse(issuesList);
  let issueIndex = -1;
  for (let i = 0; i < issuesListArray.length; i++) {
    if (issuesListArray[i].id == issueID) {
      issueIndex = i;
      break;
    }
  }
  if (issueIndex == -1) return;
  issuesListArray[issueIndex].status = "closed";
  localStorage.setItem(dbName, JSON.stringify(issuesListArray));
  updateIssueElement(issueID);
}

addBtn.addEventListener("click", addIssue);
// load and render the issues from localstorage initially
showIssues();
