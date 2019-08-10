var express=require('express');
var fileUpload = require('express-fileupload');
const fs= require('fs');

var app=express();

var Usuario= require('../models/usuario'); 
var Medico= require('../models/medico'); 
var Hospital= require('../models/hospital'); 

// default options
app.use(fileUpload());

app.put('/:tipo/:id',(req,res,next)=>{

    var tipo=req.params.tipo;
    var id=req.params.id;

    //Tipos de colección
    var tiposValidos=['hospitales','medicos','usuarios'];

    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: {message:'Tipo de colección no es válida'},
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono ningun archivo',
            errors: {message:'Debe seleccionar una imagen'},
        });
    }

    //obtener nombre del archivo
    var archivo=req.files.imagen;
    var nombreCortado=archivo.name.split('.');
    var extensionArchivo=nombreCortado[nombreCortado.length-1];

    //Sólo estas extensiones aceptamos
    var extensionesValidas=['png','jpg','gif','jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo)<0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: {message:'Las extensiones válidas son: '+ extensionesValidas.join(', ')},
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path
    var path=`./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err,
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });

    
});

function subirPorTipo(tipo, id, nombreArchivo, res){

    if(tipo==='usuarios'){

        Usuario.findById( id, (err, usuario)=>{

            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al obtener usuario',
                    errors:{message:'Error al obtener usuario'}
                });
            }

            if(!usuario){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Usuario no existe',
                    errors:{message:'Usuario no existe'}
                });
            }

            //(Se puede validar el error)

            var pathViejo= './uploads/usuarios/'+usuario.img;

            //Si existe, elimina la imagen anterior
            if( fs.existsSync(pathViejo)) {
                fs.unlinkSync( pathViejo );
            }

            usuario.img=nombreArchivo;

            usuario.save((err, usuarioActualizado)=>{
                //(Se puede validar el error)
                
                usuarioActualizado.password=':)';

                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado,
                });
            });
        
        });

    }
    if(tipo==='medicos'){
        Medico.findById( id, (err, medico)=>{
            //(Se puede validar el error)
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al obtener medico',
                    errors:{message:'Error al obtener medico'}
                });
            }

            if(!medico){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Medico no existe',
                    errors:{message:'Medico no existe'}
                });
            }

            var pathViejo= './uploads/medicos/'+medico.img;

            //Si existe, elimina la imagen anterior
            if( fs.existsSync(pathViejo)) {
                fs.unlinkSync( pathViejo );
            }

            medico.img=nombreArchivo;

            medico.save((err, medicoActualizado)=>{
                //(Se puede validar el error)

                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado,
                });
            });
        
        });
    }
    if(tipo==='hospitales'){

        Hospital.findById(id, (err, hospital)=>{
            //(Se puede validar el error)
            if(err){
                return res.status(500).json({
                    ok:false,
                    mensaje:'Error al obtener hospital',
                    errors:{message:'Error al obtener hospital'}
                });
            }

            if(!hospital){
                return res.status(400).json({
                    ok:false,
                    mensaje:'Hospital no existe',
                    errors:{message:'Hospital no existe'}
                });
            }

            var pathViejo= './uploads/hospitales/'+hospital.img;

            //Si existe, elimina la imagen anterior
            if( fs.existsSync(pathViejo)) {
                fs.unlinkSync( pathViejo );
            }

            hospital.img=nombreArchivo;

            hospital.save((err, hospitalActualizado)=>{
                //(Se puede validar el error)
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje:'Error al actualizar imagen',
                        errors:{message:'Error al actualizar imagen'}
                    });
                }

                return res.status(200).json({
                    ok:true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado,
                });
            });
        
        });
    }

}

module.exports = app ;