// payment.js
const { ipcRenderer } = require('electron');

function handlePayment(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const status = document.getElementById('status').value;
    const duedate = document.getElementById('duedate').value;

    ipcRenderer.send('submit-payment', { name, amount, status, duedate });

    ipcRenderer.once('payment-submitted', (event, response) => {
        if (response.success) {
            alert('Payment submitted successfully!');
        } else {
            alert('Error submitting payment: ' + response.message);
        }
    });
}
