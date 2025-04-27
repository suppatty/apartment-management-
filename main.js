const { app, BrowserWindow, ipcMain } = require ('electron');
const bcrypt = require('bcrypt');
const db = require('./js/db');  // Import the db.js connection
    




    function createWindow () {
        const win = new BrowserWindow({
            width:800,
            height:600,
            webPreferences: {
                nodeIntegration: true,   // Ensure nodeIntegration is true so you can use Node.js APIs in your renderer
                contextIsolation: false  // Disable context isolation to allow full access to Node.js APIs in the renderer
              }
        });

win.loadFile('html/index.html');

    }

    app.whenReady().then(createWindow);


// IPC handler for signup form
ipcMain.on('signup-form', async (event, formData) => {
    const { email, password } = formData;
  
    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert email and hashed password into the signup table
      db.query(
        'INSERT INTO signup (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('Error inserting signup data:', err.message);
            event.reply('signup-result', { success: false, message: 'Sign-up failed!' });
            return;
          }
  
          // If successful, reply to the renderer process
          event.reply('signup-result', { success: true, message: 'Successfully registered!' });
        }
      );
    } catch (error) {
      event.reply('signup-result', { success: false, message: 'Error occurred!' });
    }
  });

// Listen for login attempt from renderer process
ipcMain.on('login-attempt', (event, { email, password }) => {
    // Query the database to get the user with the provided email
    db.query('SELECT * FROM signup WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            event.reply('login-result', { success: false });
            return;
        }

        // If no user is found
        if (results.length === 0) {
            event.reply('login-result', { success: false });
            return;
        }

        // Compare the hashed password from the database with the entered password
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                // Wrong password
                event.reply('login-result', { success: false });
            } else {
                // Successful login
                event.reply('login-result', { success: true });
            }
        });
    });
});











                            // ewankoooooo



function loadUnits(event) {
    db.query('SELECT * FROM unit', (err, units) => {
        if (err) {
            console.error('Error fetching units:', err);
        } else {
            // Send the updated units list to the renderer
            event.reply('units-list', units);
        }
    });
}
                                                // ito ay para sa vacant script


// Fetch units from the database
ipcMain.on('fetch-units', (event) => {
  db.query('SELECT * FROM unit', (err, results) => {
      if (err) {
          console.error('Error fetching units:', err);
          event.reply('units-list', []); // Send empty array on error
      } else {
          event.reply('units-list', results); // Send fetched units back to renderer
      }
  });
});



                            // unitssssssssssssssss
    
    ipcMain.on('add-unit', (event, { unitNum, status }) => {
        db.query('INSERT INTO unit (unitNum, status) VALUES (?, ?)', [unitNum, status], (err, result) => {
        if (err) {
            console.error('Error adding unit:', err);
        } else {
            // Fetch updated unit list and reply to the renderer
            db.query('SELECT * FROM unit', (err, unitss) => {
            if (!err) {
                event.reply('units-list', unitss); // Send the updated list to the renderer
            }
            });
        }
        });
    });
  




                                // for updating
    ipcMain.on('update-unit', (event, { id, unitNum, status }) => {
        db.query('UPDATE unit SET unitNum = ?, status = ? WHERE id = ?', [unitNum, status, id], (err) => {
            if (err) {
                console.error('Error updating unit:', err);
            } else {
                // Reload the updated units list and send it back to the renderer
                loadUnits(event);
            }
        });
    });
    





// Handle unit deletion
ipcMain.on('delete-unit', (event, id) => {
    db.query('DELETE FROM unit WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting unit:', err);
        } else {
            // Reload the updated units list and send it back to the renderer
            loadUnits(event);
        }
    });
});




                        // ito ay para sa admin profile 




    // Fetch all admins from the "signup" table
    ipcMain.on('fetch-admins', (event) => {
        const query = 'SELECT id, email, password FROM signup';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching admins:', err);
                event.reply('admins-list', { success: false, error: err.message });
            } else {
                event.reply('admins-list', { success: true, data: results });
            }
        });
    });

    // Add admin (example for insert)
    ipcMain.on('add-admin', (event, adminData) => {
        const { email, password } = adminData;
        const query = 'INSERT INTO signup (email, password) VALUES (?, ?)';
        db.query(query, [email, password], (err) => {
            if (err) {
                console.error('Error adding admin:', err);
                event.reply('admin-added', { success: false, error: err.message });
            } else {
                event.reply('admin-added', { success: true });
            }
        });
    });

    // Delete admin
    ipcMain.on('delete-admin', (event, adminId) => {
        const query = 'DELETE FROM signup WHERE id = ?';
        db.query(query, [adminId], (err) => {
            if (err) {
                console.error('Error deleting admin:', err);
                event.reply('admin-deleted', { success: false, error: err.message });
            } else {
                event.reply('admin-deleted', { success: true });
            }
        });
    });

    // Edit admin
    ipcMain.on('edit-admin', (event, adminData) => {
        const { id, email, password } = adminData;
        const query = 'UPDATE signup SET email = ?, password = ? WHERE id = ?';
        db.query(query, [email, password, id], (err) => {
            if (err) {
                console.error('Error editing admin:', err);
                event.reply('admin-updated', { success: false, error: err.message });
            } else {
                event.reply('admin-updated', { success: true });
            }
        });
    });













                // signin


// // Listen for adding tenant request from renderer process
// ipcMain.on('add-tenant', (event, tenantData) => {
//     const { name, phone, email, password } = tenantData;

//     const query = 'INSERT INTO signin (name, phone, email, password) VALUES (?, ?, ?, ?)';
//     db.query(query, [name, phone, email, password], (err, result) => {
//         if (err) {
//             console.error('Error adding tenant:', err);
//             event.reply('add-tenant-response', { success: false, message: 'Failed to add tenant.' });
//         } else {
//             console.log('Tenant added:', result);
//             event.reply('add-tenant-response', { success: true, message: 'Tenant added successfully.' });
//         }
//     });
// });



// ipcMain.on('fetch-tenants', (event) => {
//     const query = `
//         SELECT id, name, phone, email, password
//         FROM signin
//     `;
    
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching tenants:', err);
//             event.reply('tenant-data', []); // Send an empty array on error
//         } else {
//             event.reply('tenant-data', results); // Send the results back to the renderer
//         }
//     });
// });




// Listen for adding tenant request from renderer process
ipcMain.on('add-tenant', (event, tenantData) => {
    const { name, unit, phone, email, password } = tenantData; // Include unit

    const query = 'INSERT INTO signin (name, unit, phone, email, password) VALUES (?, ?, ?, ?, ?)'; // Added unit to the query
    db.query(query, [name, unit, phone, email, password], (err, result) => {
        if (err) {
            console.error('Error adding tenant:', err);
            event.reply('add-tenant-response', { success: false, message: 'Failed to add tenant.' });
        } else {
            console.log('Tenant added:', result);
            event.reply('add-tenant-response', { success: true, message: 'Tenant added successfully.' });
        }
    });
});

















                                // new



// // IPC handler for updating tenant data
// ipcMain.on('update-tenant', (event, tenant) => {
//     const { id, name, phone, email, password } = tenant;
//     const query = `
//         UPDATE signin 
//         SET name = ?, phone = ?, email = ?, password = ?
//         WHERE id = ?
//     `;
//     db.query(query, [name, phone, email, password, id], (err, results) => {
//         if (err) {
//             console.error('Error updating tenant:', err);
//         } else {
//             event.reply('tenant-updated', results);
//             // Optionally, fetch the updated list of tenants again
//             fetchTenants(event);
//         }
//     });
// });

// // IPC handler for deleting tenant data
// ipcMain.on('delete-tenant', (event, tenantId) => {
//     const query = `
//         DELETE FROM signin WHERE id = ?
//     `;
//     db.query(query, [tenantId], (err, results) => {
//         if (err) {
//             console.error('Error deleting tenant:', err);
//         } else {
//             event.reply('tenant-deleted', results);
//             // Optionally, fetch the updated list of tenants again
//             fetchTenants(event);
//         }
//     });
// });




// // Function to fetch tenant data (also used in IPC handlers)
// function fetchTenants(event) {
//     const query = `
//         SELECT id, name, phone, email, password
//         FROM signin
//     `;
    
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching tenants:', err);
//             if (event) {
//                 event.reply('tenant-data', []); // Send an empty array on error
//             }
//         } else {
//             if (event) {
//                 event.reply('tenant-data', results); // Send the results back to the renderer
//             }
//         }
//     });
// }


                    // para sa all tenant




// // Handle tenant updates
// ipcMain.on('update-tenant', (event, tenant) => {
//     const { id, name, phone, email, password, unit } = tenant;
//     const query = `UPDATE signin SET name = ?, phone = ?, email = ?, password = ?, unit = ? WHERE id = ?`;
    
//     db.query(query, [name, phone, email, password, unit, id], (err, result) => {
//         if (err) {
//             event.reply('update-response', { success: false, error: err.message });
//             return;
//         }
//         event.reply('update-response', { success: true });
//     });
// });

// // Handle tenant deletion
// ipcMain.on('delete-tenant', (event, id) => {
//     const query = `DELETE FROM signin WHERE id = ?`;
    
//     db.query(query, [id], (err, result) => {
//         if (err) {
//             event.reply('delete-response', { success: false, error: err.message });
//             return;
//         }
//         event.reply('delete-response', { success: true });
//     });
// });





ipcMain.on('fetch-tenants', (event) => {
    const query = `SELECT id, name, phone, email, password, unit FROM signin`;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tenants:', err);
            event.reply('tenant-data', []); // Send an empty array on error
        } else {
            event.reply('tenant-data', results); // Send the results back to the renderer
        }
    });
});



















// para sa payment 
// Route to handle payment form submission
ipcMain.on('submit-payment', (event, paymentData) => {
    const { name, amount, status, duedate } = paymentData;

    // Query to get tenant_id based on the name
    const tenantQuery = 'SELECT id FROM signin WHERE name = ?';
    db.query(tenantQuery, [name], (err, results) => {
        if (err) {
            event.reply('payment-response', { success: false, error: 'Error fetching tenant ID' });
            return;
        }

        if (results.length === 0) {
            event.reply('payment-response', { success: false, error: 'Tenant not found' });
            return;
        }

        const tenant_id = results[0].id; // Get the tenant_id from the query result

        // Insert payment data into the pay table
        const sql = 'INSERT INTO pay (name, status, amount, duedate, tenant_id) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [name, status, amount, duedate, tenant_id], (err) => {
            if (err) {
                event.reply('payment-response', { success: false, error: 'Error inserting payment data' });
            } else {
                event.reply('payment-response', { success: true, message: 'Payment recorded successfully!' });
            }
        });
    });
});




















// ipcMain.on('submit-payment', (event, paymentData) => {
//     const { name, amount, status, duedate } = paymentData;

//     // Query to get tenant_id based on the name
//     const tenantQuery = 'SELECT id FROM signin WHERE name = ?';
//     db.query(tenantQuery, [name], (err, results) => {
//         if (err) {
//             event.reply('payment-response', { success: false, error: 'Error fetching tenant ID' });
//             return;
//         }

//         if (results.length === 0) {
//             event.reply('payment-response', { success: false, error: 'Tenant not found' });
//             return;
//         }

//         const tenant_id = results[0].id;

//         // Insert payment data into the pay table
//         const sql = 'INSERT INTO pay (name, status, amount, duedate, tenant_id) VALUES (?, ?, ?, ?, ?)';
//         db.query(sql, [name, status, amount, duedate, tenant_id], (err) => {
//             if (err) {
//                 event.reply('payment-response', { success: false, error: 'Error inserting payment data' });
//             } else {
//                 event.reply('payment-response', { success: true, message: 'Payment recorded successfully!' });
//             }
//         });
//     });
// });


// para sa payment 

ipcMain.on('submit-payment', (event, paymentData) => {
    const { name, amount, status, duedate } = paymentData;
    const query = `
        INSERT INTO payments (name, amount, status, duedate, tenant_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    const tenantId = 1; // Placeholder for tenant_id; replace with the actual tenant_id if available

    db.query(query, [name, amount, status, duedate, tenantId], (error, results) => {
        if (error) {
            console.error(error);
            event.reply('payment-submitted', { success: false, message: error.message });
        } else {
            event.reply('payment-submitted', { success: true });
        }
    });
});







// ipcMain.handle('fetch-due-dates', async () => {
//     return new Promise((resolve, reject) => {
//         connection.query('SELECT name, duedate FROM payments', (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// });









// Fetch message from the database




// ipcMain.on('fetch-messages', (event) => {
//     const query = `SELECT id, tenant_id, message FROM messages`;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching messages:', err);
//             event.reply('fetch-messages-reply', { success: false, error: err.message }); // Send error response
//         } else {
//             console.log('Query Results:', results); // Debug log
//             event.reply('fetch-messages-reply', { success: true, data: results }); // Send success response
//         }
//     });
// });

ipcMain.on('fetch-messages', (event) => {
    const query = 'SELECT id, tenant_id, message FROM messages';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err);
            event.reply('fetch-messages-reply', { success: false, error: err.message });
        } else {
            event.reply('fetch-messages-reply', { success: true, data: results });
        }
    });
});




// para sa duedate
// Fetch due dates from the database


// Handle the request to fetch due dates
ipcMain.handle('fetch-due-dates', async () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT name, duedate FROM pay', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
});











// adasdasdasdasd
ipcMain.on('print-receipt', (event, receiptContent) => {
    const printerInstance = new printer.Printer(printer.printerTypes.EPSON);
    printerInstance.alignCenter();
    printerInstance.text(receiptContent);
    printerInstance.cut();
    printerInstance.close();
  });
















                                // wag buburahin hahahhahaha

    app.on ('window-all-closed', () => {
        if(process.platform !== 'darwin') app.quit();
    })