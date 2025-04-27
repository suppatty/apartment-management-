const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',       
  database: 'realme',   
});


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database!');
});








module.exports = connection;


