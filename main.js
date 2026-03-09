console.log("app.js loaded!");

let allIssues = [];
let searchQuery = "";
// currentTab comes from toggle.js


// load all issues from the api
function loadIssues() {
    showLoader();
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {
        allIssues = data.data;
        displayIssues(allIssues);
    });
}

loadIssues();


function displayIssues(issues) {

    // filter by tab first
    let filtered = [];

    for(let issue of issues) {
        if(currentTab === "all") {
            filtered.push(issue);
        } else if(issue.status === currentTab) {
            filtered.push(issue);
        }
    }

    // then filter by search
    if(searchQuery != "") {
        let q = searchQuery.toLowerCase();
        let searchFiltered = [];

        for(let issue of filtered) {
            let match = issue.title.toLowerCase().includes(q)
                     || issue.description.toLowerCase().includes(q)
                     || issue.author.toLowerCase().includes(q)
                     || issue.priority.toLowerCase().includes(q)
                     || issue.status.toLowerCase().includes(q);

            // also check inside labels array
            for(let label of issue.labels) {
                if(label.toLowerCase().includes(q)) {
                    match = true;
                }
            }

            if(match) {
                searchFiltered.push(issue);
            }
        }

        filtered = searchFiltered;
    }

    // update the count text
    document.getElementById("issue-count").textContent = filtered.length + " Issues";

    // clear old cards
    const grid = document.getElementById("issues-grid");
    grid.innerHTML = "";

    // show empty state if nothing found
    if(filtered.length === 0) {
        hideLoader();
        grid.classList.add("hidden");
        document.getElementById("empty-state").classList.remove("hidden");
        return;
    }

    document.getElementById("empty-state").classList.add("hidden");

    // loop through and create a card for each issue
    for(let i = 0; i < filtered.length; i++) {
        const card = createIssueCard(filtered[i], i);
        grid.appendChild(card);
    }

    hideLoader();
}


function createIssueCard(issue, i) {
    // console.log(issue);

    const isOpen = issue.status === "open";

    // build labels html
    let labelsHTML = "";
    for(let label of issue.labels) {
        labelsHTML += `<span class="text-[0.58rem] font-bold px-2 py-0.5 rounded-full ${getLabelClass(label)}">${label}</span>`;
    }

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("issue-card", "card-anim");
    cardDiv.style.animationDelay = i * 25 + "ms";

    cardDiv.innerHTML = `
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm
                    hover:-translate-y-1 hover:shadow-md transition-all duration-200
                    cursor-pointer flex flex-col h-full ${isOpen ? "card-open" : "card-closed"}">

            <div class="p-4 flex flex-col flex-1">

                <div class="flex items-start justify-between gap-2 mb-2.5">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isOpen ? "bg-green-100" : "bg-purple-100"}">
                        <i class="fa-solid ${isOpen ? "fa-circle-dot text-green-600" : "fa-check text-purple-500"} text-[8px]"></i>
                    </div>
                    <span class="text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${getPriorityClass(issue.priority)}">
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
                    <div>#${issue.id} by ${issue.author}</div>
                    <div>${formatDate(issue.createdAt)}</div>
                </div>

            </div>
        </div>
    `;

    cardDiv.addEventListener("click", function() {
        showIssueDetails(issue);
    });

    return cardDiv;
}


function showIssueDetails(issue) {
    // console.log(issue);

    const isOpen = issue.status === "open";

    const badge = document.getElementById("modal-badge");
    if(isOpen) {
        badge.textContent = "Open";
        badge.className = "text-[0.7rem] font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200";
    } else {
        badge.textContent = "Closed";
        badge.className = "text-[0.7rem] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200";
    }

    document.getElementById("modal-meta").textContent = "Opened by " + issue.author + " • " + formatDate(issue.createdAt);
    document.getElementById("modal-title").textContent = issue.title;
    document.getElementById("modal-desc").textContent = issue.description;
    document.getElementById("modal-assignee").textContent = issue.assignee || "Unassigned";
    document.getElementById("modal-status").textContent = issue.status;
    document.getElementById("modal-created").textContent = formatDate(issue.createdAt);

    const prioEl = document.getElementById("modal-priority");
    prioEl.textContent = issue.priority.toUpperCase();
    prioEl.className = "text-[0.65rem] font-bold px-2.5 py-1 rounded-full " + getPriorityClass(issue.priority);

    const labelsEl = document.getElementById("modal-labels");
    labelsEl.innerHTML = "";
    for(let label of issue.labels) {
        const span = document.createElement("span");
        span.textContent = label;
        span.className = "text-[0.62rem] font-semibold px-2.5 py-1 rounded-full " + getLabelClass(label);
        labelsEl.appendChild(span);
    }

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
    if(e.target === this) {
        closeModal();
    }
});
document.addEventListener("keydown", function(e) {
    if(e.key === "Escape") {
        closeModal();
    }
});


// search
document.getElementById("search-input").addEventListener("keyup", function(e) {
    searchQuery = e.target.value;
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


function getPriorityClass(priority) {
    if(priority === "high") return "bg-red-50 text-red-700 border border-red-200";
    if(priority === "medium") return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-green-50 text-green-700 border border-green-200";
}


function getLabelClass(label) {
    if(label === "bug") return "bg-red-100 text-red-800";
    if(label === "help wanted") return "bg-blue-100 text-blue-800";
    if(label === "enhancement") return "bg-emerald-100 text-emerald-800";
    if(label === "good first issue") return "bg-violet-100 text-violet-800";
    if(label === "documentation") return "bg-amber-100 text-amber-800";
    return "bg-slate-100 text-slate-700";
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    });
}

