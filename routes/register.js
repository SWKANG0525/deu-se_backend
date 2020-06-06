const express = require('express');
const app = express();
const path = require('path');
const mapper = require('mybatis-mapper');
const dbconn = require('../config/sqlConfiguration.js');
const mapperPath = path.join(__dirname, '../sql/Auth.xml');
mapper.createMapper([mapperPath]);

const format = {language: 'sql', indent: ' '};

//사용자 회원가입
app.post('/register/customer', function(req, res) {

    let params = req.body;  
    let query = mapper.getStatement('Auth', 'insert_customer', params, format);
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

app.post('/register/airline_staff', function(req, res) {

    let params = req.body;  
    let query = mapper.getStatement('Auth', 'insert_airline_staff', params, format);
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


module.exports = app;