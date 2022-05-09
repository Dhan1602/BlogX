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
        cards: posts,
        mas: false
    });
});

app.get("/crear", async function (req, res) {
    var posts = await publicaciones.find();

    res.render("crear", {
        seleccionado: "Crear",
        title: "Crear un post",
        link: "/crearPublicacion",
        boton: "Publicar",
        editando: false,
        cards: posts,
    });
});

app.post("/crearPublicacion", async (req, res) => {
    var posts = await publicaciones.find();
    const fecha = new Date();
    var dia = (fecha.getFullYear()) + "/" + ((fecha.getMonth() + 1)) + "/" + (fecha.getDay() + 1);
    var hora = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var dcorta = (req.body.descripcion).substring(0, 25) + "...";
    var nueva_publicacion = new publicaciones({
        autor: req.body.autor,
        titulo: req.body.titulo,
        imagen: req.body.imagen,
        descripcion: req.body.descripcion,
        descripcion_corta: dcorta,
        fecha: dia,
        hora: hora,
        tags: req.body.tags,
        categoria: req.body.categoria,
        cards: posts,
    });
    await nueva_publicacion.save();
    console.log("Se ha creado una nueva publicacion");
    res.redirect("/inicio");

})

app.get("/modificar/:id", async (req, res) => {
    var posts = await publicaciones.find();
    var modificando = await publicaciones.findById(req.params.id);
    res.render("crear", {
        seleccionado: "Modificando",
        title: "Modificar post",
        link: "/modificarPublicacion/" + req.params.id,
        documentos: modificando,
        boton: "Guardar",
        editando: true,
        cards: posts,
    })
})

app.post("/modificarPublicacion/:id", async (req, res) => {
    const fecha = new Date();
    var dia = (fecha.getFullYear()) + "/" + ((fecha.getMonth() + 1)) + "/" + (fecha.getDay() + 1);
    var hora = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var dcorta = (req.body.descripcion).substring(0, 25) + "...";

    var llamada = await publicaciones.findById(req.params.id)
    llamada.autor = req.body.autor;
    llamada.titulo = req.body.titulo;
    llamada.imagen = req.body.imagen;
    llamada.descripcion = req.body.descripcion;
    llamada.descripcion_corta = dcorta;
    llamada.tags = req.body.tags;
    llamada.fecha = llamada.fecha;
    llamada.hora = llamada.hora;
    llamada.categoria = req.body.categoria
    llamada.ult_modificacion = dia + " " + hora;

    await llamada.save();
    res.redirect("/inicio")
})

app.get("/eliminar/:id", async (req, res) => {
    var elimando = await publicaciones.findById(req.params.id);
    await elimando.remove();
    console.log("se ha eliminado el elmento")
    res.redirect("/inicio")

})

app.get("/content/:id", async (req, res) => {
    var posts = await publicaciones.find();
    var mostrar = await publicaciones.findById(req.params.id);
    res.render("index", {
        seleccionado: "verMas",
        mas: true,
        documentos: mostrar,
        cards: posts,
    });
})

app.post("/busqueda", async (req, res) => {
    var todo = await publicaciones.find();
    var filtro = req.body.filtro
    var orden = req.body.ordenBusqueda
    var busqueda = req.body.busqueda
    var fecha = todo.fecha;

    if (filtro == "titulo" && orden == "reciente") {
        var posts = await publicaciones.find({ titulo: { $regex: busqueda, $options: "$i" } }).sort({fecha:-1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "autor" && orden == "reciente") {
        var posts = await publicaciones.find({ autor: { $regex: busqueda, $options: "$i" } }).sort({fecha:-1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "descripcion" && orden == "reciente") {
        var posts = await publicaciones.find({ descripcion: { $regex: busqueda, $options: "$i" } }).sort({fecha:-1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "etiquetas" && orden == "reciente") {
        var posts = await publicaciones.find({ tags: { $regex: busqueda, $options: "$i" } }).sort({fecha:-1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "categoria" && orden == "reciente") {
        var posts = await publicaciones.find({ categoria: { $regex: busqueda, $options: "$i" } }).sort({fecha:-1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "titulo" && orden == "antiguo") {                                            // De mas antiguo a mas reciente
        var posts = await publicaciones.find({ titulo: { $regex: busqueda, $options: "$i" } }).sort({fecha:1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "autor" && orden == "antiguo") {
        var posts = await publicaciones.find({ autor: { $regex: busqueda, $options: "$i" } }).sort({fecha:1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "descripcion" && orden == "antiguo") {
        var posts = await publicaciones.find({ descripcion: { $regex: busqueda, $options: "$i" } }).sort({fecha:1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "etiquetas" && orden == "antiguo") {
        var posts = await publicaciones.find({ tags: { $regex: busqueda, $options: "$i" } }).sort({fecha:1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    } else if (filtro == "categoria" && orden == "antiguo") {
        var posts = await publicaciones.find({ categoria: { $regex: busqueda, $options: "$i" } }).sort({fecha:1});
        if(posts==""){
            var noEncontrado= "No se ha encontrado ningun resultado";
        }else{
            var noEncontrado="Mentira"
        }

    }

    res.render("busqueda", {
        seleccionado: "Inicio",
        cards: posts,
        mas: false,
        encontrado: noEncontrado
    });

})




app.listen(3000);