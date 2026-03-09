console.log("toggle.js loaded!");

const allFilterBtn = document.getElementById('all-filter-btn')
const openFilterBtn = document.getElementById('open-filter-btn')
const closedFilterBtn = document.getElementById('closed-filter-btn')

let currentTab = "all"; // this is read by main.js to filter issues

function toggleStyle(id) {
    // adding gray bg for all
    allFilterBtn.classList.add('bg-white', 'text-gray-500', 'border', 'border-gray-200')
    openFilterBtn.classList.add('bg-white', 'text-gray-500', 'border', 'border-gray-200')
    closedFilterBtn.classList.add('bg-white', 'text-gray-500', 'border', 'border-gray-200')

    // if any button has blue then remove
    allFilterBtn.classList.remove('bg-[#4A00FF]', 'text-white')
    openFilterBtn.classList.remove('bg-[#4A00FF]', 'text-white')
    closedFilterBtn.classList.remove('bg-[#4A00FF]', 'text-white')

    const selected = document.getElementById(id)

    // console.log(id);

    // adding blue bg for current button
    selected.classList.remove('bg-white', 'text-gray-500', 'border', 'border-gray-200')
    selected.classList.add('bg-[#4A00FF]', 'text-white')

    // update currentTab so main.js knows which tab is active
    if(id === 'all-filter-btn')    currentTab = "all";
    if(id === 'open-filter-btn')   currentTab = "open";
    if(id === 'closed-filter-btn') currentTab = "closed";

    // re-render cards with new tab filter
    if(typeof allIssues !== "undefined") {
        displayIssues(allIssues);
    }
}