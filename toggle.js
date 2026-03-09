
const allFilterBtn = document.getElementById('all-filter-btn')
const openFilterBtn = document.getElementById('open-filter-btn')
const closedFilterBtn = document.getElementById('closed-filter-btn')

function toggleStyle(id) {
    // adding gray bg for all
    allFilterBtn.classList.add('bg-white', 'text-gray-500', 'border', 'border-gray-200')
    openFilterBtn.classList.add('bg-white', 'text-gray-500', 'border', 'border-gray-200')
    closedFilterBtn.classList.add('bg-white', 'text-gray-500', 'border', 'border-gray-200')

    // if any button has blue then remove
    allFilterBtn.classList.remove('bg-[#4A00FF]', 'text-white')
    openFilterBtn.classList.remove('bg-[#4A00FF]', 'text-white')
    closedFilterBtn.classList.remove('bg-[#4A00FF]', 'text-white')

    // console.log(id);
    const selected = document.getElementById(id)//this is the button that clicked for filter

    currentStatus = id
    console.log(currentStatus);
    // console.log(selected);

    // adding black bg for current button
    selected.classList.remove('bg-white', 'text-gray-500', 'border', 'border-gray-200')
    selected.classList.add('bg-[#4A00FF]', 'text-white')
    // step 1 finish

    // show and hidden particular section
    // step 4 start
    // filtering while clicking the filter button (All, Interview, Rejected)
    // if (id == 'interview-filter-btn') {
    //     allCardSection.classList.add('hidden');
    //     filterSection.classList.remove('hidden')
    //     renderInterview()
    // } else if (id == 'all-filter-btn') {
    //     allCardSection.classList.remove('hidden');
    //     filterSection.classList.add('hidden')
    // } else if (id == 'rejected-filter-btn') {
    //     allCardSection.classList.add('hidden');
    //     filterSection.classList.remove('hidden')
    //     renderRejected()
    // }
    // // Update job count after filter change
    // updateJobCount()
}