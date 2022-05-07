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
    var posts = await publicaciones.find();
    res.render("index", {
        seleccionado: "Inicio",
        cards: posts
    });
});

app.get("/crear", async function (req, res) {
    res.render("crear", {
        seleccionado: "Crear",
        title: "Crear un post",
        link: "/crearPublicacion",
        boton: "Publicar",
        editando: false
    });
});

app.post("/crearPublicacion", async (req, res) => {
    const fecha = new Date();
    var dia = (fecha.getFullYear()) + "/" + ((fecha.getMonth() + 1)) + "/" + (fecha.getDay()) + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var dcorta = (req.body.descripcion).substring(0, 25) + "...";
    var nueva_publicacion = new publicaciones({
        autor: req.body.autor,
        titulo: req.body.titulo,
        imagen: req.body.imagen,
        descripcion: req.body.descripcion,
        descripcion_corta: dcorta,
        fecha: dia,
        tags: req.body.tags
    });
    await nueva_publicacion.save();
    console.log("Se ha creado una nueva publicacion");
    res.redirect("/inicio");

})

app.get("/modificar/:id", async (req, res) => {
    var modificando = await publicaciones.findById(req.params.id);
    res.render("crear", {
        seleccionado: "Modificando",
        title: "Modificar post",
        link: "/modificarPublicacion/" + req.params.id,
        documentos: modificando,
        boton: "Guardar",
        editando: true
    })
})

app.post("/modificarPublicacion/:id", async (req, res) => {
    const fecha = new Date();
    var dia = (fecha.getFullYear()) + "/" + ((fecha.getMonth() + 1)) + "/" + (fecha.getDay()) + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var dcorta = (req.body.descripcion).substring(0, 25) + "...";

    var llamada = await publicaciones.findById(req.params.id)
    llamada.autor = req.body.autor;
    llamada.titulo = req.body.titulo;
    llamada.imagen = req.body.imagen;
    llamada.descripcion = req.body.descripcion;
    llamada.descripcion_corta = dcorta;
    llamada.tags = req.body.tags;
    llamada.fecha = llamada.fecha;
    llamada.ult_modificacion = dia;

    await llamada.save();
    res.redirect("/inicio")
})

app.get("/eliminar/:id", async (req, res) => {
    var elimando = await publicaciones.findById(req.params.id);
    await elimando.remove();
    console.log("se ha eliminado el elmento")
    res.redirect("/inicio")

})


app.listen(3000);