const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwtConfiguration');

const path = require('path');
const format = {language: 'sql', indent: '  '};
const dbconn = require('../config/sqlConfiguration');
const mapper = require('mybatis-mapper');
const mapperPath = path.join(__dirname, '../sql/Auth.xml');
mapper.createMapper([mapperPath]);


app.post('/auth/login', function (req, res) {

  let sql_params = req.body;
  let account_type = req.body.account_type;
  let query;

  if(account_type == "customer") 
    query = mapper.getStatement('Auth', 'login_customer', sql_params, format);
  else if(account_type == "airline_staff")
    query = mapper.getStatement('Auth', 'login_airline_staff', sql_params, format);
  else
    query = mapper.getStatement('Auth', 'login_airport_staff', sql_params, format);
   

  console.log("SQL :: " + query);
  
  dbconn.query(query, function (err, result, fields) {
      if (result.length == 1) {
          let payload = {
              id: result[0].id,
              account_type : account_type
          }
          if (err) {
       
          } else {
            let token = jwt.sign({payload},secretObj.secret,{expiresIn: '60m'})
            res.status(200).json({
              "token":token, // 정상
          });


              // response의 header에 jwt토큰 세팅
          }
          
          return;
      }
      else if (result.length > 1) { //filtering DB Error
        res.status(200).json({
          "token":"false" // 정상
      });

          return;
      }
      else {
        res.status(200).json({
          "token":"false"// 정상
      });

          return;
      }
  });
});



module.exports = app;
