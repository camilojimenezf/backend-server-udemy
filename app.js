//Requires
var express=require('express');
var mongoose=require('mongoose');


//Inicializar variables
var app=express();

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',(err,res)=>{

    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.get('/',(req,res,next)=>{
    res.status(200).json({
        ok:true,
        mensaje:'peticion realizada correctamente'
    });
});


//Escuchar peticiones
app.listen(3001, ()=>{
    console.log('Express Server puerto 3001:\x1b[32m%s\x1b[0m', 'online');
});