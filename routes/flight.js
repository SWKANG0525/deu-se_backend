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

app.post('/flight/identifier', function(req, res) {

  let params = req.body;  
  let query = mapper.getStatement('Flight', 'airline_flight_list_identifier', params, format);
  console.log(query);

  dbconn.query(query, function(err, result, fields) {
      if (err) {
              res.status(200).json({
                  "result":err // Query Error
              })
              return;
          } else {

              res.status(200).json({
                "airplane_name": result[0].airplane_name,
                "start_airport": result[0].start_airport,
                "dest_airport":  result[0].dest_airport,
                "via": result[0].via,
                "identifier": result[0].identifier,
                "status": result[0].status,
                "start_date": result[0].start_date,
                "end_date": result[0].end_date,
                "airline_kor": result[0].airline_kor,
                "first_seat_num": result[0].first_seat_num,
                "business_seat_num": result[0].business_seat_num,
                "economy_seat_num": result[0].economy_seat_num,
                "sign": result[0].sign
              });
              return;
          }
      }); 
});





module.exports = app;
