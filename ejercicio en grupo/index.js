const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

//configuraciones
app.use(bodyParser.urlencoded({ extended: true }));

var path = __dirname + "/src/views";
app.set("views", path);
app.set("view engine", "ejs");

//Mongo
mongoose.connect
    ("mongodb+srv://prueba123:prueba123@cluster0.tmt1b.mongodb.net/Blog?retryWrites=true&w=majority"
    ).then((base) => {
        console.log("Se ha conectado con éxito a la base de datos");
    }).catch((err) => {
        console.log("Oops, ¡Ha ocurrido un error! " + err);
    })

//Require del modelo
var publicaciones = require("./src/models/posts");


app.get("/inicio", async function (req, res) {
    res.render("index",{
        seleccionado: "Inicio"
    });
});

app.get("/crear", async function (req, res) {
    res.render("crear",{
        seleccionado:"Crear"
    });
});

app.post("/crearPublicacion", async (req, res)=>{
    const fecha = new Date();
    var dia = (fecha.getFullYear())+"/"+((fecha.getMonth()+1))+"/"+(fecha.getDay())+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds();
    console.log(req.body.descripcion);
    var nueva_publicacion = new publicaciones({
        autor:req.body.autor,
        titulo:req.body.titulo,
        imagen:req.body.imagen,
        descripcion:req.body.descripcion,
        fecha:dia,
        tags:req.body.tags
    });
    await nueva_publicacion.save();
    console.log("Se ha creado una nueva publicacion");
    res.redirect("/crear");

})

app.listen(3000);