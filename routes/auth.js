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

app.post('/auth/api_verify', function(req, res) {

  let jwttoken = req.body.apiKey;
  var decoded = jwt.verify(jwttoken, secretObj.secret);
  console.log(decoded.payload.id);
  let query;
  if(decoded.payload.account_type == "customer") {
    query = mapper.getStatement('Auth', 'check_customer',{"id" : decoded.payload.id}, format);
    console.log(query);
    dbconn.query(query, function(err, result, fields) {
   
            if (result.length > 0){ 
                res.status(200).json({  
                    "result":"true" // 정상
                });
                return;
            }
  
            else if (result.length == 0){
              res.status(200).json({
                "result":"false" // 정상
            });
                return;
            } 
            
            else {
                if (err) {
                  res.status(500).json({
                    "result":err // 정상
                });
                }            
                return;
            }
        
  });
 } else if(decoded.payload.account_type == "airline_staff") {
   console.log(decoded.payload.airline_kor);
  query = mapper.getStatement('Auth','check_airline_staff', {"id" : decoded.payload.id}, format);
  
  console.log(query);
  dbconn.query(query, function(err, result, fields) {
 
          if (result.length > 0){ 
              res.status(200).json({  
                  "result":"true", // 정상
                  "airline_kor":decoded.payload.airline_kor
              });
              return;
          }

          else if (result.length == 0){
            res.status(200).json({
              "result":"false" // 정상
          });
              return;
          } 
          
          else {
              if (err) {
                res.status(500).json({
                  "result":err // 정상
              });
              }            
              return;
          }
      
});
}});



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
      if (result.length == 1 && account_type=="airline_staff") {
          let payload = {
              id: result[0].id,
              account_type : account_type,
              airline_kor : result[0].airline_kor

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

      else if (result.length == 1 && account_type=="customer") {
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

app.get('/customers/:id', function(req, res) {

  let params = req.params;
  let query = mapper.getStatement('Auth', 'check_customer', params, format);
  
  console.log(query);
  
  dbconn.query(query, function(err, result, fields) {
 
          if (result.length == 0){ //결과 없음
              res.status(200).json({  
                  "result":"true" // 정상
              });
              return;
          }

          else if (result.length == 1){
            res.status(200).json({
              "result":"false" // 정상
          });
              return;
          } 
          
          else {
              if (err) {
                res.status(500).json({
                  "result":err // 정상
              });
              }            
              return;
          }
      
});
});

app.get('/airline_staffs/:id', function(req, res) {

  let params = req.params;
  let query = mapper.getStatement('Auth', 'check_airline_staff', params, format);
  
  console.log(query);
  
  dbconn.query(query, function(err, result, fields) {
 
          if (result.length == 0){ //결과 없음
              res.status(200).json({  
                  "result":"true" // 정상
              });
              return;
          }

          else if (result.length == 1){
            res.status(200).json({
              "result":"false" // 정상
          });
              return;
          } 
          
          else {
              if (err) {
                res.status(500).json({
                  "result":err // 정상
              });
              }            
              return;
          }
      
});
});

app.post('/customers/name', function(req, res) {

  let params = req.body;
  let query = mapper.getStatement('Auth', 'select_customer_name', params, format);
  
  console.log(query);
  
  dbconn.query(query, function(err, result, fields) {
 
          if (result.length != 0){ //결과 없음
              res.status(200).json({  
                  "result":result[0].name_kor // 정상
              });
              return;
          }

          else if (result.length == 0){
            res.status(200).json({
              "result":"false" // 정상
          });
              return;
          } 
          
          else {
              if (err) {
                res.status(500).json({
                  "result":err // 정상
              });
              }            
              return;
          }
      
});
});

app.post('/airline_staff/name', function(req, res) {

  let params = req.body;
  let query = mapper.getStatement('Auth', 'select_airline_staff_name', params, format);
  
  console.log(query);
  
  dbconn.query(query, function(err, result, fields) {
 
          if (result.length != 0){ //결과 없음
              res.status(200).json({  
                  "result":result[0].name_kor // 정상
              });
              return;
          }

          else if (result.length == 0){
            res.status(200).json({
              "result":"false" // 정상
          });
              return;
          } 
          
          else {
              if (err) {
                res.status(500).json({
                  "result":err // 정상
              });
              }            
              return;
          }
      
});
});
app.get('/version', function(req, res) {

 
                res.status(200).json({
                  "version":"Beta 1.0.6" // 정상
              });
                      
             
          
      

});




module.exports = app;
