console.log("main.js loaded!");

let allIssues = [];
let searchQuery = "";
// currentTab is declared in toggle.js


// fetch all issues on page load
const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

showLoader();

fetch(url)
    .then(response => response.json())
    .then(data => {
        allIssues = data.data;
        displayIssues(allIssues);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


function displayIssues(issues) {

    // filter by tab (currentTab comes from toggle.js)
    let filtered = [];
    for(let issue of issues) {
        if(currentTab === "all") {
            filtered.push(issue);
        } else if(issue.status === currentTab) {
            filtered.push(issue);
        }
    }

    // filter by search
    if(searchQuery != "") {
        let q = searchQuery.toLowerCase();
        let searchFiltered = [];

        for(let issue of filtered) {
            let match = issue.title.toLowerCase().includes(q)
                     || issue.description.toLowerCase().includes(q)
                     || issue.author.toLowerCase().includes(q)
                     || issue.priority.toLowerCase().includes(q)
                     || issue.status.toLowerCase().includes(q);

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

    // update count
    document.getElementById("issue-count").textContent = filtered.length + " Issues";

    const grid = document.getElementById("issues-grid");
    grid.innerHTML = "";

    // empty state
    if(filtered.length === 0) {
        hideLoader();
        grid.classList.add("hidden");
        document.getElementById("empty-state").classList.remove("hidden");
        return;
    }

    document.getElementById("empty-state").classList.add("hidden");

    // build each card
    for(let i = 0; i < filtered.length; i++) {
        const issue = filtered[i];
        const formattedDate = new Date(issue.createdAt).toLocaleDateString();

        // status icon and border color
        let borderColor = "";
        let statusIcon = "";

        if(issue.status === "open") {
            borderColor = "card-open";
            statusIcon = `<img src="./assets/Open-Status.png" alt="open" onerror="this.outerHTML='<i class=\'fa-solid fa-circle-dot text-green-500\'></i>'" >`;
        } else {
            borderColor = "card-closed";
            statusIcon = `<img src="./assets/Closed- Status .png" alt="closed" onerror="this.outerHTML='<i class=\'fa-solid fa-check-circle text-purple-500\'></i>'" >`;
        }

        // priority badge color
        let priorityClass = "";
        if(issue.priority === "high") {
            priorityClass = "bg-red-50 text-red-700 border border-red-200";
        } else if(issue.priority === "medium") {
            priorityClass = "bg-amber-50 text-amber-700 border border-amber-200";
        } else {
            priorityClass = "bg-green-50 text-green-700 border border-green-200";
        }

        // labels html
        let labelsHTML = "";
        for(let label of issue.labels) {
            let labelClass = "bg-slate-100 text-slate-700";

            if(label === "bug") {
                labelClass = "bg-red-100 text-red-800";
            } else if(label === "help wanted") {
                labelClass = "bg-blue-100 text-blue-800";
            } else if(label === "enhancement") {
                labelClass = "bg-emerald-100 text-emerald-800";
            } else if(label === "good first issue") {
                labelClass = "bg-violet-100 text-violet-800";
            } else if(label === "documentation") {
                labelClass = "bg-amber-100 text-amber-800";
            }

            labelsHTML = labelsHTML + `<span class="text-[0.58rem] font-bold px-2 py-0.5 rounded-full ${labelClass}">${label}</span>`;
        }

        // card html — same structure as reference
        const cardHTML = `
        <div onclick="openModal(${issue.id})" class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm
                    hover:-translate-y-1 hover:shadow-md transition-all duration-200
                    cursor-pointer flex flex-col card-anim ${borderColor}"
             style="animation-delay: ${i * 25}ms">

            <div class="p-4 flex flex-col flex-1">

                <div class="flex items-start justify-between gap-2 mb-2.5">
                    ${statusIcon}
                    <span class="text-[0.6rem] font-bold px-2 py-0.5 rounded-full ${priorityClass}">
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
                    <p>${formattedDate}</p>
                </div>

            </div>
        </div>
        `;

        grid.innerHTML = grid.innerHTML + cardHTML;
    }

    hideLoader();
}


// open modal — fetch single issue by id (same as reference)
function openModal(id) {
    const modalUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issue/" + id;

    fetch(modalUrl)
        .then(response => response.json())
        .then(data => {
            const issue = data.data;
            showIssueDetails(issue);
        })
        .catch(error => {
            console.error('Error fetching issue details:', error);
        });
}


function showIssueDetails(issue) {
    // console.log(issue);

    const isOpen = issue.status === "open";
    const formattedDate = new Date(issue.createdAt).toLocaleDateString();

    // status badge
    const badge = document.getElementById("modal-badge");
    if(isOpen) {
        badge.textContent = "Open";
        badge.className = "text-[0.7rem] font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200";
    } else {
        badge.textContent = "Closed";
        badge.className = "text-[0.7rem] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200";
    }

    document.getElementById("modal-meta").textContent = "Opened by " + issue.author + " • " + formattedDate;
    document.getElementById("modal-title").textContent = issue.title;
    document.getElementById("modal-desc").textContent = issue.description;
    document.getElementById("modal-assignee").textContent = issue.assignee || "Not Assigned";
    document.getElementById("modal-status").textContent = issue.status;
    document.getElementById("modal-created").textContent = formattedDate;

    // priority badge
    const prioEl = document.getElementById("modal-priority");
    prioEl.textContent = issue.priority.toUpperCase();
    if(issue.priority === "high") {
        prioEl.className = "text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200";
    } else if(issue.priority === "medium") {
        prioEl.className = "text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200";
    } else {
        prioEl.className = "text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200";
    }

    // labels
    const labelsEl = document.getElementById("modal-labels");
    labelsEl.innerHTML = "";
    for(let label of issue.labels) {
        const span = document.createElement("span");
        span.textContent = label;
        span.className = "text-[0.62rem] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700";
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