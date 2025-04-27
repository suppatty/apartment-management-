// const { ipcRenderer } = require('electron');

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('Sending fetch-messages request...');
//     ipcRenderer.send('fetch-messages'); // Request to fetch messages
// });

// ipcRenderer.on('fetch-messages-reply', (event, response) => {
//     console.log('Received fetch-messages-reply:', response); // Debug log

//     if (response.success) {
//         const messageBody = document.getElementById('messageBody');
//         messageBody.innerHTML = ''; // Clear previous data

//         response.data.forEach((message) => {
//             console.log('Appending message:', message); // Debug log
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${message.id}</td>
//                 <td>${message.tenant_id}</td>
//                 <td>${message.message}</td>
//                 <td>
//                     <button class="ok-button" onclick="handleOkClick(${message.id})">OK</button>
//                 </td>
//             `;
//             messageBody.appendChild(row);
//         });
//     } else {
//         console.error('Error fetching messages:', response.error);
//     }
// });

// function handleOkClick(messageId) {
//     alert(`You clicked OK for message ID: ${messageId}`);
// }








const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('fetch-messages');
});

ipcRenderer.on('fetch-messages-reply', (event, response) => {
    const messageBody = document.getElementById('messageBody');
    messageBody.innerHTML = '';

    if (response.success) {
        if (response.data.length === 0) {
            messageBody.innerHTML = '<tr><td colspan="4">No messages found.</td></tr>';
        } else {
            response.data.forEach((message) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${message.id}</td>
                    <td>${message.tenant_id}</td>
                    <td>${message.message}</td>
                    <td>
                        <button class="ok-button" onclick="handleOkClick(${message.id})">OK</button>
                    </td>
                `;
                messageBody.appendChild(row);
            });
        }
    } else {
        console.error('Error fetching messages:', response.error);
        messageBody.innerHTML = '<tr><td colspan="4">Error fetching messages.</td></tr>';
    }
});

function handleOkClick(messageId) {
    // Future improvements can involve marking the message as read or other actions
    console.log(`You clicked OK for message ID: ${messageId}`);
    alert(`You clicked OK for message ID: ${messageId}`);
}
