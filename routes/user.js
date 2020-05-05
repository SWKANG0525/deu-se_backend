const express = require('express');
const app = express();

const path = require('path');
const mapper = require('mybatis-mapper');
const dbconn = require('../config/sqlConfiguration.js');
const mapperPath = path.join(__dirname, '../sql/Auth.xml');
mapper.createMapper([mapperPath]);

const format = {language: 'sql', indent: ' '};

//사용자 회원가입
app.post('/register', function(req, res) {

    let params = req.body;  

    try {
        let query = mapper.getStatement('Auth', 'insert_customer', params, format);
        console.log(query);
        dbconn.query(query, function(err, result, fields) {
            if (err) {
                res.status(200).json({
                    "test":"false" // Query Error
                })
                return;
            } else {

                res.status(200).json({
                    "test":"ok" // 정상
                });
                return;
            }
        });
    } catch (error) {
        res.status(503).json({
            "test":"error" // Server Error
        });
        return;
    }    
});


module.exports = app;