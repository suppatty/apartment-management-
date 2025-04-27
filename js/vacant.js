

const { ipcRenderer } = require('electron');

// Load existing units on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUnits();
});






// Load units from the database
function loadUnits() {
    ipcRenderer.send('fetch-units'); // Send request to fetch units from the database
}







// Handle fetching unit data from the backend
ipcRenderer.on('units-list', (event, units) => {
    const unitContainer = document.getElementById('unitContainer');
    unitContainer.innerHTML = ''; // Clear existing units

    units.forEach((unit) => {
        const newUnit = document.createElement('div');
        newUnit.className = 'units';
        newUnit.setAttribute('data-id', unit.id); // Set data-id for later reference

        newUnit.innerHTML = `
            <div class="unit-num">${unit.unitNum}</div>
            <div class="status">${unit.status}</div>
            <div class="info"><a class="in" href="#">Info..</a></div>
            <button class="delete-btn">Delete</button>
        `;

        unitContainer.appendChild(newUnit);
    });
});




// Function to handle unit deletion
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const unit = event.target.parentElement; // Get the parent unit div
        const unitNum = unit.querySelector('.unit-num').innerText;

        // Ask for confirmation before deleting
        if (confirm(`Are you sure you want to delete ${unitNum}?`)) {
            const id = unit.getAttribute('data-id'); // Use data-id for deletion
            ipcRenderer.send('delete-unit', id);
            unit.remove(); // Remove the unit from the frontend
        }
    } else if (event.target.classList.contains('in')) {
        event.preventDefault(); // Prevent default anchor action
        const unit = event.target.parentElement.parentElement; // Get the unit div
        const unitNum = unit.querySelector('.unit-num').innerText;
        const status = unit.querySelector('.status').innerText;

        // Fill the edit form with current values
        document.getElementById('unitName').value = unitNum;
        document.getElementById('unitStatus').value = status;

        // Show the edit form
        document.getElementById('editForm').style.display = 'block';

        // Save changes
        document.getElementById('saveChangesBtn').onclick = function() {
            const unitId = unit.getAttribute('data-id'); // Use data-id for updates

            // Update unit in the database
            const newUnitNum = document.getElementById('unitName').value;
            const newStatus = document.getElementById('unitStatus').value;

            ipcRenderer.send('update-unit', { id: unitId, unitNum: newUnitNum, status: newStatus });

            // Update the displayed unit
            unit.querySelector('.unit-num').innerText = newUnitNum;
            unit.querySelector('.status').innerText = newStatus;

            // Hide the edit form after saving
            document.getElementById('editForm').style.display = 'none';
        };
    }
});

                        // jdhgalkushgdqljkw












                                    // new






document.getElementById('addunitform').addEventListener('submit', (e) => {
e.preventDefault(); // Prevent the page from refreshing

// Get the input values
const unit = {
unitNum: document.getElementById('unitNum').value,
status: document.getElementById('status').value,
};
                                    
// Send the unit data to the backend
ipcRenderer.send('add-unit', unit); // Correct event name here

// Clear the form after submission
 document.getElementById('addunitform').reset();
});
                                    