'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
//middlewares
app.use(bodyParser.urlencoded({extendend:false}));
app.use(bodyParser.json());

//cors 

//rutas
app.use('/api', user_routes);

// app.get('/',(req,res) => {
//     res.status(200).send({
//         message:'Home Brad'
//     });
// });

// app.post('/pruebapost',(req,res) => {
//     console.log(req.body);
//     res.status(200).send({
//         message : 'prueba de post'
//     });
// });

// app.get('/pruebas',(req,res) => {
//     res.status(200).send({
//         message: 'Acción de pruebas en nodejs'
//     });
// });

//exportar
module.exports = app;