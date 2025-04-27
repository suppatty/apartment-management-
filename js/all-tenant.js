// all-tenant.js
const { ipcRenderer } = require('electron');

// Function to open the edit modal and populate data
function openEditModal(tenant) {
    document.getElementById('editTenantId').value = tenant.id;
    document.getElementById('editTenantName').value = tenant.name;
    document.getElementById('editTenantUnit').value = tenant.unit;
    document.getElementById('editTenantPhone').value = tenant.phone;
    document.getElementById('editTenantEmail').value = tenant.email;
    document.getElementById('editTenantPassword').value = tenant.password;

    document.getElementById('editTenantModal').style.display = 'block'; // Show modal
}

// Function to handle tenant updates
document.getElementById('editTenantForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const tenant = {
        id: document.getElementById('editTenantId').value,
        name: document.getElementById('editTenantName').value,
        phone: document.getElementById('editTenantPhone').value,
        email: document.getElementById('editTenantEmail').value,
        password: document.getElementById('editTenantPassword').value,
        unit: document.getElementById('editTenantUnit').value
    };

    ipcRenderer.send('update-tenant', tenant); // Send update request to main process

    // Listen for response
    ipcRenderer.on('update-response', (event, response) => {
        if (response.success) {
            alert('Tenant updated successfully!');
            // Refresh the tenant table here
        } else {
            alert('Error updating tenant: ' + response.error);
        }
        document.getElementById('editTenantModal').style.display = 'none'; // Hide modal
    });
});

// Function to handle tenant deletion
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const tenantId = /* Get the ID of the tenant to delete */
    ipcRenderer.send('delete-tenant', tenantId); // Send delete request to main process

    // Listen for response
    ipcRenderer.on('delete-response', (event, response) => {
        if (response.success) {
            alert('Tenant deleted successfully!');
            // Refresh the tenant table here
        } else {
            alert('Error deleting tenant: ' + response.error);
        }
        document.getElementById('deleteTenantModal').style.display = 'none'; // Hide modal
    });
});

// Function to close modals
document.querySelectorAll('.close').forEach(element => {
    element.addEventListener('click', () => {
        element.closest('.modal').style.display = 'none'; // Hide modal
    });
});




// Fetch tenants on page load
ipcRenderer.send('fetch-tenants');

ipcRenderer.on('tenant-data', (event, tenants) => {
    const tenantBody = document.getElementById('tenantBody');
    tenantBody.innerHTML = ''; // Clear existing entries

    tenants.forEach(tenant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tenant.id}</td>
            <td>${tenant.name}</td>
            <td>${tenant.unit}</td>
            <td>${tenant.phone}</td>
            <td>${tenant.email}</td>
            <td>${tenant.password}</td>
            <td>
                <button onclick='openEditModal(${JSON.stringify(tenant)})'>Edit</button>
                <button onclick='confirmDelete(${tenant.id}, "${tenant.name}")'>Delete</button>
            </td>
        `;
        tenantBody.appendChild(row);
    });
});






function confirmDelete(tenantId, tenantName) {
    document.getElementById('deleteTenantName').innerText = tenantName;
    document.getElementById('deleteTenantModal').style.display = 'block'; // Show delete confirmation modal

    document.getElementById('confirmDeleteButton').onclick = function () {
        ipcRenderer.send('delete-tenant', tenantId); // Trigger delete
    };
}


// Listen for update response
ipcRenderer.on('update-response', (event, response) => {
    if (response.success) {
        alert('Tenant updated successfully!');
        ipcRenderer.send('fetch-tenants'); // Refresh tenant list
    } else {
        alert('Error updating tenant: ' + response.error);
    }
});

// Listen for delete response
ipcRenderer.on('delete-response', (event, response) => {
    if (response.success) {
        alert('Tenant deleted successfully!');
        ipcRenderer.send('fetch-tenants'); // Refresh tenant list
    } else {
        alert('Error deleting tenant: ' + response.error);
    }
});


