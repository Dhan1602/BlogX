var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var post = new Schema({
    autor:String,
    titulo:String,
    imagen:String,
    descripcion:{
        type: String,
        default:"..."
    },
    descripcion_corta:{
        type: String,
        default:"..."
    },
    fecha:String,
    ult_modificacion:{
        type: String,
        default:"Nunca"
    },
    tags:String,
});

module.exports = mongoose.model("Publicaciones", post);