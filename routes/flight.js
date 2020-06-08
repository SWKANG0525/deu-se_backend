const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwtConfiguration');

const path = require('path');
const format = {language: 'sql', indent: '  '};
const dbconn = require('../config/sqlConfiguration');
const mapper = require('mybatis-mapper');
const mapperPath = path.join(__dirname, '../sql/Flight.xml');
mapper.createMapper([mapperPath]);

app.post('/flight/date', function (req, res) {

    //req apiKey, date(%y-%m-%d)
  let sql_params = req.body;
  let start_date = req.body.start_date;
  console.log(start_date);
  let query = mapper.getStatement('Flight', 'date_flight_list', sql_params, format);

  console.log("SQL :: " + query);
  
  dbconn.query(query, function (err, result, fields) {
    if (result.length >= 1) {
      if(err) {

        res.status(500).json({
          "result":err
        })
        return;

      }
      else {
        res.status(200).json({
          "result":result
          });
          return;
        }
  }

  else {
    
    res.status(200).json({
      "result":"none"
    })
  }

});
});

app.post('/flight/register', function(req, res) {

  let params = req.body;  
  let query = mapper.getStatement('Flight', 'insert_flight_list', params, format);
  console.log(query);

  dbconn.query(query, function(err, result, fields) {
      if (err) {
              res.status(200).json({
                  "result":err // Query Error
              })
              return;
          } else {

              res.status(200).json({
                  "result":"true" // 정상
              });
              return;
          }
      }); 
});

app.post('/flight/list', function(req, res) {

  let params = req.body;  
  let query = mapper.getStatement('Flight', 'airline_flight_list', params, format);
  console.log(query);

  dbconn.query(query, function(err, result, fields) {
      if (err) {
              res.status(200).json({
                  "result":err // Query Error
              })
              return;
          } else {

              res.status(200).json({
                  "result":result// 정상
              });
              return;
          }
      }); 
});






module.exports = app;
