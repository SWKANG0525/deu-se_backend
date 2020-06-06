const mysql = require('mysql');  //My-sql을 사용하였다.
 
const dbConn = mysql.createConnection({  //커넥션 생성
  host: '49.50.163.131',
  user: 'se_deu',
  database: 'deu_se',
  password : 'se_deu'
});
dbConn.connect();

module.exports = dbConn;

 
  