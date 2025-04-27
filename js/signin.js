// const { ipcRenderer } = require('electron');

// document.getElementById('addTenantForm').addEventListener('submit', (e) => {
//     e.preventDefault();

//     const tenantData = {
//         name: document.getElementById('name').value,
//         phone: document.getElementById('phone').value,
//         email: document.getElementById('email').value,
//         password: document.getElementById('password').value,
//     };

//     // Send tenant data to main process
//     ipcRenderer.send('add-tenant', tenantData);

//     // Listen for response from main process
//     ipcRenderer.once('add-tenant-response', (event, response) => {
//         const responseMessage = document.getElementById('responseMessage');
//         if (response.success) {
//             responseMessage.innerText = response.message;
//             responseMessage.style.color = 'green';
//         } else {
//             responseMessage.innerText = response.message;
//             responseMessage.style.color = 'red';
//         }

//         // Clear form
//         document.getElementById('addTenantForm').reset();
//     });
// });







const { ipcRenderer } = require('electron');

document.getElementById('addTenantForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const tenantData = {
        name: document.getElementById('name').value,
        unit: document.getElementById('unitNumber').value, // Capture the unit number
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    // Send tenant data to main process
    ipcRenderer.send('add-tenant', tenantData);

    // Listen for response from main process
    ipcRenderer.once('add-tenant-response', (event, response) => {
        const responseMessage = document.getElementById('responseMessage');
        if (response.success) {
            responseMessage.innerText = response.message;
            responseMessage.style.color = 'green';
        } else {
            responseMessage.innerText = response.message;
            responseMessage.style.color = 'red';
        }

        // Clear form
        document.getElementById('addTenantForm').reset();
    });
});
