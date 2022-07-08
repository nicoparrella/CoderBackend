const Contenedor = require("../Contenedor");
const contenedorProducts = new Contenedor("./db/products.json", "./db/productIds.json", "./db/deletedProducts.json", "Producto");
contenedorProducts.init("Productos");

const getAllProducts = (req, res)=>{
    res.json(contenedorProducts.getAll());
}

const getProductById = (req, res)=>{
    if (req.params.id){
        res.json(contenedorProducts.getById(Number(req.params.id)));
    } else{
        getAllProducts(req, res);
    }
}

const postProduct = async (req, res)=>{
    res.json(await contenedorProducts.save(req.body))
}

const putProduct = async (req, res)=>{
    res.json(await contenedorProducts.saveById(Number(req.params.id), req.body));
}

const deleteProductById = async (req, res)=>{
    res.json(await contenedorProducts.deleteById(Number(req.params.id)));
}
module.exports = {contenedorProducts, getAllProducts, getProductById, postProduct, putProduct, deleteProductById}