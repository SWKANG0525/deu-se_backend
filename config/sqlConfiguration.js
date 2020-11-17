const mysql = require('mysql');  //My-sql을 사용하였다.
 
const dbConn = mysql.createConnection({  //커넥션 생성
  host: '',
  user: '',
  database: '',
  password : ''
});
dbConn.connect();

module.exports = dbConn;

 
  
