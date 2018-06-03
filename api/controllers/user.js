'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function home(req, res){
    res.status(200).send({
        message: 'Hola mundo'
    });
}

function pruebas(req, res) {
    res.status(200).send({
        message: 'Hola mundo'
    });
}

//registro
function saveUser(req,res){
    var user = new User();
    var params = req.body;

    if(params.name && params.surname && params.nick && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
// controlar usuarios duplicados        
        User.find({$or: [
            {email : user.email.toLowerCase()},
            {nick: user.nick.toLowerCase()}
        ]}).exec((err,users)=> {
            if(err) return res.status(500).send({
                message:'Error en la peticion de usuarios'
            });
            if(users && users.length >= 1){
                return res.status(200).send({
                    message: 'El usuario que intenta registrar ya existe'
                });
            }else{
//cifra la contraseña y guarda 
        bcrypt.hash(params.password,null,null,(err, hash) => {
            user.password = hash;
            user.save((err,userStored)=> {
                if(err) return res.status(500).send({
                    message: 'Error al guardar el usuario'
                });

                if(userStored){
                    res.status(200).send({
                        user:userStored
                    });
                }else{
                    res.status(404).send({
                        message:'No se ha registrado el usuario'
                    });
                }

            });
        });
            }
        });

        // user.password = params.password;
    }else{
        res.status(200).send({
            message:'Envia todos los campos necesarios man!'
        });
    }
}

//login
function loginUser(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email}, (err,user) => {
        if (err) return res.status(500).send({
                message: 'Error en la peticion'
            });

        if(user){
            
            bcrypt.compare(password,user.password, (err, check)=>{
                if(check){
                    
                    if (params.gettoken) {
                        //devolver un token
                        return res.status(200).send({ 
                            token: jwt.createToken(user)
                        });
                        //generar el token
                    } else {
                        //devolver datos de usuario
                        user.password = undefined;
                        return res.status(200).send({
                            user
                        });
                    }
                    
                }else{
                  return  res.status(404).send({
                        message: 'El usuario no se ha podido identificar'
                    });
                }
            });
        }else{
           return res.status(404).send({
                message: 'El usuario no se ha podido identificar!!'
            });
        }    
    });
}

//conseguiur datos de un usuario
function getUser(req,res){
    var userId = req.params.id;

    User.findById(userId,(err,user)=>{
        if (err) 
            return res.status(500).send({
                message: 'error en la peticion'
            });

        if (!user)
            return res.status(404).send({
                message: 'El usuario no existe'
            });   
        return res.status(200).send({
            user
        });    
    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser
}