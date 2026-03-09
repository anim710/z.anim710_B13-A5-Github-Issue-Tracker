console.log("main.js loaded!");

// currentTab is declared in toggle.js

let allIssues = [];
let searchText = "";


showLoader();
// fetch data from api
fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
.then(res => res.json())
.then(data => {
    // console.log(data);
    allIssues = data.data;
    displayIssues(allIssues);
})




function displayIssues(issues) {

    // step 1: filter by tab
    let filtered = [];

    for(let i = 0; i < issues.length; i++) {
        let issue = issues[i];

        if(currentTab == "all") {
            filtered.push(issue);
        }
        else if(currentTab == "open" && issue.status == "open") {
            filtered.push(issue);
        }
        else if(currentTab == "closed" && issue.status == "closed") {
            filtered.push(issue);
        }
    }

    // step 2: filter by search text
    if(searchText != "") {

        let searchResult = [];

        for(let i = 0; i < filtered.length; i++) {
            let issue = filtered[i];
            let q = searchText.toLowerCase();

            // check title and description
            if(issue.title.toLowerCase().includes(q)) {
                searchResult.push(issue);
            }
            else if(issue.description.toLowerCase().includes(q)) {
                searchResult.push(issue);
            }
            else if(issue.author.toLowerCase().includes(q)) {
                searchResult.push(issue);
            }
            else if(issue.priority.toLowerCase().includes(q)) {
                searchResult.push(issue);
            }
            else {
                // check labels
                for(let j = 0; j < issue.labels.length; j++) {
                    if(issue.labels[j].toLowerCase().includes(q)) {
                        searchResult.push(issue);
                        break;
                    }
                }
            }
        }

        filtered = searchResult;
    }

    // step 3: update issue count
    document.getElementById("issue-count").textContent = filtered.length + " Issues";

    // step 4: clear the grid
    let grid = document.getElementById("issues-grid");
    grid.innerHTML = "";

    // step 5: show empty state if no issues
    if(filtered.length == 0) {
        hideLoader();
        grid.classList.add("hidden");
        document.getElementById("empty-state").classList.remove("hidden");
        return;
    }

    document.getElementById("empty-state").classList.add("hidden");

    // step 6: loop and create cards
    for(let i = 0; i < filtered.length; i++) {

        let issue = filtered[i];
        let date = new Date(issue.createdAt).toLocaleDateString();

        // border color based on status
        let borderClass = "";
        let statusImg = "";

        if(issue.status == "open") {
            borderClass = "card-open";
            statusImg = '<img src="./assets/Open-Status.png" alt="open status" width="20">';
        }
        else {
            borderClass = "card-closed";
            statusImg = '<img src="./assets/Closed- Status .png" alt="closed status" width="20">';
        }

        // priority color
        let priorityColor = "";

        if(issue.priority == "high") {
            priorityColor = "bg-red-50 text-red-700 border border-red-200";
        }
        else if(issue.priority == "medium") {
            priorityColor = "bg-amber-50 text-amber-700 border border-amber-200";
        }
        else {
            priorityColor = "bg-green-50 text-green-700 border border-green-200";
        }

        // labels
        let labelsHTML = "";

        for(let j = 0; j < issue.labels.length; j++) {

            let label = issue.labels[j];
            let labelColor = "bg-slate-100 text-slate-700";
            let icon = "";

            if(label == "bug") {
                labelColor = "bg-red-100 text-red-800";
                icon = '<i class="fa-solid fa-bug mr-1"></i> ';
            }
            else if(label == "help wanted") {
                labelColor = "bg-blue-100 text-blue-800";
                icon = '<i class="fa-solid fa-life-ring mr-1"></i> ';
            }
            else if(label == "enhancement") {
                labelColor = "bg-emerald-100 text-emerald-800";
                icon = '<i class="fa-solid fa-rocket mr-1"></i> ';
            }
            else if(label == "good first issue") {
                labelColor = "bg-violet-100 text-violet-800";
                icon = '<i class="fa-solid fa-thumbs-up mr-1"></i> ';
            }
            else if(label == "documentation") {
                labelColor = "bg-amber-100 text-amber-800";
                icon = '<i class="fa-solid fa-file-lines mr-1"></i> ';
            }

            labelsHTML += `<span class="text-[0.58rem] font-bold px-2 py-0.5 rounded-full ${labelColor}">${icon} ${label}</span>`;
        }

        // build card html
        let cardHTML = `
            <div onclick="openModal(${issue.id})" class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col card-anim ${borderClass}" style="animation-delay: ${i * 25}ms">

                <div class="p-4 flex flex-col flex-1">

                    <div class="flex items-start justify-between gap-2 mb-2.5">
                        ${statusImg}
                        <span class="text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${priorityColor}">
                            ${issue.priority.toUpperCase()}
                        </span>
                    </div>

                    <h3 class="text-[0.83rem] font-semibold text-slate-900 leading-snug mb-1.5 line-clamp-2">
                        ${issue.title}
                    </h3>

                    <p class="text-[0.75rem] text-slate-400 leading-relaxed mb-3 line-clamp-2">
                        ${issue.description}
                    </p>

                    <div class="flex flex-wrap gap-1 mb-3">
                        ${labelsHTML}
                    </div>

                    <div class="mt-auto pt-2.5 border-t border-slate-100 text-[0.7rem] text-slate-400 font-mono space-y-0.5">
                        <p>#${issue.id} by ${issue.author}</p>
                        <p>${date}</p>
                    </div>

                </div>
            </div>
        `;

        grid.innerHTML += cardHTML;
    }

    hideLoader();
}


// when a card is clicked, fetch that issue details
function openModal(id) {
    // console.log("opening modal for id: " + id);

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issue/" + id)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        showModal(data.data);
    })
}


function showModal(issue) {

    let date = new Date(issue.createdAt).toLocaleDateString();

    // set status badge color
    let badge = document.getElementById("modal-badge");

    if(issue.status == "open") {
        badge.textContent = "Open";
        badge.className = "text-[0.7rem] font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200";
    }
    else {
        badge.textContent = "Closed";
        badge.className = "text-[0.7rem] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200";
    }

    // fill in details
    document.getElementById("modal-meta").textContent = "Opened by " + issue.author + " • " + date;
    document.getElementById("modal-title").textContent = issue.title;
    document.getElementById("modal-desc").textContent = issue.description;
    document.getElementById("modal-created").textContent = date;
    document.getElementById("modal-status").textContent = issue.status;

    if(issue.assignee == "") {
        document.getElementById("modal-assignee").textContent = "Not Assigned";
    }
    else {
        document.getElementById("modal-assignee").textContent = issue.assignee;
    }

    // priority badge
    let prioEl = document.getElementById("modal-priority");
    prioEl.textContent = issue.priority.toUpperCase();

    if(issue.priority == "high") {
        prioEl.className = "text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200";
    }
    else if(issue.priority == "medium") {
        prioEl.className = "text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200";
    }
    else {
        prioEl.className = "text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200";
    }

    // labels in modal
    let labelsEl = document.getElementById("modal-labels");
    labelsEl.innerHTML = "";

    for(let i = 0; i < issue.labels.length; i++) {
        let label = issue.labels[i];
        let icon = "";
        let labelColor = "bg-slate-100 text-slate-700";

        if(label == "bug") {
            labelColor = "bg-red-100 text-red-800";
            icon = "🐛";
        }
        else if(label == "help wanted") {
            labelColor = "bg-blue-100 text-blue-800";
            icon = "🙋";
        }
        else if(label == "enhancement") {
            labelColor = "bg-emerald-100 text-emerald-800";
            icon = "✨";
        }
        else if(label == "good first issue") {
            labelColor = "bg-violet-100 text-violet-800";
            icon = "🌱";
        }
        else if(label == "documentation") {
            labelColor = "bg-amber-100 text-amber-800";
            icon = "📄";
        }

        let span = document.createElement("span");
        span.textContent = icon + " " + label;
        span.className = "text-[0.62rem] font-semibold px-2.5 py-1 rounded-full " + labelColor;
        labelsEl.appendChild(span);
    }

    // show modal
    document.getElementById("modal-overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
}


function closeModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
    document.body.style.overflow = "";
}

document.getElementById("modal-close-x").addEventListener("click", closeModal);
document.getElementById("modal-close-btn").addEventListener("click", closeModal);

document.getElementById("modal-overlay").addEventListener("click", function(e) {
    if(e.target == this) {
        closeModal();
    }
});

document.addEventListener("keydown", function(e) {
    if(e.key == "Escape") {
        closeModal();
    }
});


// search
document.getElementById("search-input").addEventListener("keyup", function(e) {
    searchText = e.target.value;
    displayIssues(allIssues);
});


function showLoader() {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("issues-grid").classList.add("hidden");
    document.getElementById("empty-state").classList.add("hidden");
}

function hideLoader() {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("issues-grid").classList.remove("hidden");
}