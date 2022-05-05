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
    fecha:String,
    tags:String,
});

module.exports = mongoose.model("Publicaciones", post);