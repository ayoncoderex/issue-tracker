let dbName = "issueDB";

const issueDescription = document.getElementById("description");
const issueSeverity = document.getElementById("severity");
const issueAssignedTo = document.getElementById("assigned-to");
const addBtn = document.getElementById("add");

function resetIssueInput() {
  issueDescription.value = "";
  issueAssignedTo.value = "";
}

function checkIssue(issue) {
  let msg = "ok";
  if (issue.description === "") msg = "Please describe your issue.";
  if (issue.description.length > 250 || issue.description.length < 3)
    msg = "Issue description must be between 3 and 250 characters long.";
  if (issue.assignedTo === "") msg = "Please type an asignee name.";
  return msg;
}

function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
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
  } else {
    alert(checkResult);
  }
}
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
addBtn.addEventListener("click", addIssue);
