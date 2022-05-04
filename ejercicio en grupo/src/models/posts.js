var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var post = new Schema({
    autor:String,
    titulo:String,
    descripcion:{
        type: String,
        default:"..."
    },
    fecha:String
});

module.exports = mongoose.model("Publicaciones", post);