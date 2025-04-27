const { ipcRenderer } = require('electron');

document.getElementById('print-receipt').addEventListener('click', () => {
    // Retrieve input values
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const dueDate = document.getElementById('due-date').value;

    // Validate inputs
    if (!name || !amount || !dueDate) {
        alert('Please fill in all fields before printing.');
        return;
    }

    // Create receipt content
    const receiptContent = `
        <html>
            <head>
                <style>
                    body { font-family: "Courier New", Courier, monospace; font-size: 16px; width: 300px; }
                    h2 { text-align: center; }
                    p { margin: 5px 0; }
                </style>
            </head>
            <body>
                <h2>Payment Receipt</h2>
                <hr>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Amount:</strong> ${amount}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                <hr>
                <p style="text-align: center;">Thank you for your payment!</p>
            </body>
        </html>
    `;

    // Send content to the main process for printing
    ipcRenderer.send('print-receipt', receiptContent);
});
