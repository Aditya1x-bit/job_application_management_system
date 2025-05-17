const mysql =require('mysql2/promise')
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'job_application',
    password: '',
    port: '3306'
})


connection.getConnection()
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

module.exports = connection;