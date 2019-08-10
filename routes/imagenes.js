var express=require('express');

var app=express();

const path=require('path');
const fs=require('fs');

app.get('/:tipo/:img',(req,res,next)=>{

    var tipo= req.params.tipo;
    var img=req.params.img;

    var pathImagen=path.resolve( __dirname , `../uploads/${tipo}/${img}`); //le indicamos la direccion de la imagen en el servidor guiandonos por los params recibidos por url

    if( fs.existsSync( pathImagen ) ){ //si la imagen existe devuelve un true
        res.sendFile( pathImagen );
    }else {
        var pathNoImagen= path.resolve( __dirname, '../assets/no-img.jpg');
        res.sendFile( pathNoImagen);
    }

 
});

module.exports = app ;