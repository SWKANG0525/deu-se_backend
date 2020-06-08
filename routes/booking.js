const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwtConfiguration');

const path = require('path');
const format = { language: 'sql', indent: '  ' };
const dbconn = require('../config/sqlConfiguration');
const mapper = require('mybatis-mapper');
const mapperPath = path.join(__dirname, '../sql/Booking.xml');
const mapperFlightPath = path.join(__dirname, '../sql/Flight.xml');

mapper.createMapper([mapperPath]);
mapper.createMapper([mapperFlightPath]);

app.post('/booking/check_seat_remain', function (req, res) {

    //req apiKey, identifier;

    let sql_params = req.body;

    let first_seat_num = 0;
    let business_seat_num = 0;
    let economy_seat_num = 0;

    console.log(sql_params);
    let flightquery = mapper.getStatement('Flight', 'select_flight_book_count', sql_params, format);
    let query = mapper.getStatement('Booking', 'select_booking_list_count', sql_params, format);

    console.log("SQL :: " + flightquery);
    console.log("SQL :: " + query);

    dbconn.query(flightquery, function (err, result, fields) {
        if (result.length >= 1) {
            if (err) {

                res.status(500).json({
                    "result": err
                })
                return;
            }
            else {

                first_seat_num = result[0].first_seat_num;
                business_seat_num = result[0].business_seat_num;
                economy_seat_num = result[0].economy_seat_num;
            }



        }
        else {

        }

    });

    dbconn.query(query, function (err, result, fields) {

        if (result.length >= 1) {
            if (err) {
                res.status(500).json({
                    "result": err
                })
            }

            else {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].seat_grade == 'B')
                        business_seat_num -= result[i].seat_num;
                    else if (result[i].seat_grade == 'E')
                        economy_seat_num -= result[i].seat_num;
                    else if (result[i].seat_grade == 'F')
                        first_seat_num -= result[i].seat_num;
                }

                res.status(200).json({

                    "first_seat_num": first_seat_num,
                    "business_seat_num": business_seat_num,
                    "economy_seat_num": economy_seat_num
                })

            }
        } else {
            res.status(200).json({
                "first_seat_num": first_seat_num,
                "business_seat_num": business_seat_num,
                "economy_seat_num": economy_seat_num
            })
        }
    })


});

app.post('/booking/check_seat', function (req, res) {

    let first_seat_num = 0;
    let business_seat_num = 0;
    let economy_seat_num = 0;
    let params = req.body;
    let query = mapper.getStatement('Booking', 'select_booking_list_count', params, format);
    console.log(query);

    dbconn.query(query, function (err, result, fields) {

        if (result.length >= 1) {
            if (err) {
                res.status(500).json({
                    "result": err
                })
            }

            else {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].seat_grade == 'B')
                        business_seat_num = result[i].seat_num;
                    else if (result[i].seat_grade == 'E')
                        economy_seat_num = result[i].seat_num;
                    else if (result[i].seat_grade == 'F')
                        first_seat_num = result[i].seat_num;
                }

                res.status(200).json({

                    "first_seat_num": first_seat_num + 1,
                    "business_seat_num": business_seat_num + 1,
                    "economy_seat_num": economy_seat_num + 1
                })

            }
        } else {
            res.status(200).json({
                "first_seat_num": first_seat_num + 1,
                "business_seat_num": business_seat_num + 1,
                "economy_seat_num": economy_seat_num + 1
            })
        }
    })
});


app.post('/booking/flight', function (req, res) {


    let params = req.body;
    let query = mapper.getStatement('Booking', 'insert_booking_list', params, format);
    console.log(query);

    dbconn.query(query, function (err, result, fields) {

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
