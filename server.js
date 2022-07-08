const express = require("express");
const apiProductRoutes = require("./routes/apiProductRoutes")
const apiCartRoutes = require("./routes/apiCartRoutes")
require('dotenv').config()
const port = process.env.PORT || 8080;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/productos", apiProductRoutes)
app.use("/api/carrito", apiCartRoutes)

app.use((req, res) => {
    res.status(404).json({error: -2, descripcion: `Ruta '${req.path}' Método '${req.method}' - No Implementada`});
})

app.use(function (err, req, res, next) {
    res.status(500).json({
        error: err.message,
    });
});

app.listen(port, (err) => {
    if (!err) {
        console.log(`El servidor se inicio en el puerto ${port}`)
    } else {
        console.log(`Hubo un error al iniciar el servidor: `, err)
    }
})