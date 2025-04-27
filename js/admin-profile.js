const { ipcRenderer } = require('electron');

// Fetch admins when the page loads
document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('fetch-admins');
});

// Populate the admin list when the data is received
ipcRenderer.on('admins-list', (event, response) => {
    if (response.success) {
        const admins = response.data;
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Clear previous data

        admins.forEach(admin => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${admin.id}</td>
                <td>${admin.email}</td>
                <td>${admin.password}</td>
                <td>
                   
                    <button class="delete-btn" onclick="deleteAdmin(${admin.id})">Delete Account</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } else {
        console.error('Error fetching admin list:', response.error);
    }
});



// Delete an admin
function deleteAdmin(adminId) {
    const confirmation = confirm('Are you sure you want to delete admin with ID: ' + adminId + '?');
    if (confirmation) {
        ipcRenderer.send('delete-admin', adminId);
    }
}

// Handle responses for adding, deleting, and updating admins
ipcRenderer.on('admin-added', (event, response) => {
    if (response.success) {
        alert('Admin added successfully!');
    } else {
        alert('Error adding admin: ' + response.error);
    }
});

ipcRenderer.on('admin-deleted', (event, response) => {
    if (response.success) {
        alert('Admin deleted successfully!');
    } else {
        alert('Error deleting admin: ' + response.error);
    }
});

ipcRenderer.on('admin-updated', (event, response) => {
    if (response.success) {
        alert('Admin updated successfully!');
    } else {
        alert('Error updating admin: ' + response.error);
    }
});
