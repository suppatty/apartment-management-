// const { ipcRenderer } = require('electron');

// // Function to populate the table with due dates
// async function loadDueDates() {
//     try {
//         // Fetch data from the main process
//         const dueDates = await ipcRenderer.invoke('fetch-due-dates');

//         const tableBody = document.querySelector('#unitTable tbody');
//         tableBody.innerHTML = ''; // Clear existing rows

//         // Populate the table with rows from the database
//         dueDates.forEach((tenant) => {
//             const row = document.createElement('tr');

//             const nameCell = document.createElement('td');
//             nameCell.textContent = tenant.name;
//             row.appendChild(nameCell);

//             const dueDateCell = document.createElement('td');
//             dueDateCell.textContent = new Date(tenant.due_date).toLocaleDateString();
//             row.appendChild(dueDateCell);

//             tableBody.appendChild(row);
//         });
//     } catch (error) {
//         console.error('Error loading due dates:', error);
//     }
// }

// // Call the loadDueDates function when the page loads
// window.addEventListener('DOMContentLoaded', loadDueDates);
// Import the required modules
const { ipcRenderer } = require('electron');

// Fetch the tenants' names and due dates from the database
ipcRenderer.invoke('fetch-due-dates').then((data) => {
    // Select the table body
    const tableBody = document.querySelector('#unitTable tbody');

    // Loop through the data and create rows for each tenant
    data.forEach((row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.name}</td><td>${row.duedate}</td>`;
        tableBody.appendChild(tr);
    });
});
