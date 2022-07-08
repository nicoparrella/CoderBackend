const fs = require("fs");

class ContenedorProducts {
    constructor(productsFile, idsFile, deletedFile, type) {
        this.productsFile = productsFile;
        this.productIdsFile = idsFile;
        this.deleted = deletedFile;
        this.products = [];
        this.productIds = [];
        this.type = type;
    }

    async save(objeto) {
        objeto.timestamp = Date.now();
        objeto.objType?objeto.cartList=[]:[];
        try {
            if (this.productIds.length === 0) {
                this.productIds.push(1);
                objeto.id = 1;
            } else {
                this.productIds.push(this.productIds[this.productIds.length - 1] + 1);
                objeto.id = this.productIds[this.productIds.length - 1];
            }
            await fs.promises.writeFile(this.productIdsFile, JSON.stringify(this.productIds));
            this.products.push(objeto)
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
            console.log("Producto cargado");
            return objeto;
        } catch (err) {
            console.log("Error guardando producto. Code: ", err);
        }
    }

    async saveById(id, objeto) {
        const index = this.products.findIndex(producto => producto.id === id)
        if (index != -1) {
            objeto.timestamp = Date.now();
            objeto.id = id;
            this.products[index] = objeto;

            try {
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
            } catch (err) {
                console.log("Error guardando producto por ID. Code: ", err)
            }

            return this.products[index];
        } else {
            return { error: `Producto con ID ${id} no encontrado` }
        }
    }

    getById(id) {
        const objeto = this.products.find(producto => producto.id === id);
        return (objeto ? objeto : { error: `Producto con ID ${id} no encontrado` });
    }

    getAll() {
        return (this.products);
    }

    async deleteById(id) {
        const index = this.products.findIndex(producto => producto.id === id)
        if (index != -1) {
            const removedItem = this.products.splice(index, 1)[0];
            let removedItems = []

            try {
                removedItems = JSON.parse(await fs.promises.readFile(this.deleted, "utf-8"))
                removedItems.push(removedItem);
                await fs.promises.writeFile(this.deleted, JSON.stringify(removedItems));
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
            } catch (err) {
                if (err.code === 'ENOENT') {
                    await fs.promises.writeFile(this.deletedFile, JSON.stringify([removedItem]));
                } else {
                    console.log("Error eliminando por ID. Code: ", err)
                }
            }
            return { success: `${this.type} con ID ${id} eliminado` }
        } else {
            return { error: `${this.type} con ID ${id} no encontrado` }
        }
    }

    async deleteAll() {
        const removedItem = this.products;
        const removedItems = [];
        this.products = [];

        try {
            removedItems = JSON.parse(await fs.promises.readFile(this.deleted, "utf-8"))
            removedItems.push(removedItem);
            await fs.promises.writeFile(this.deleted, JSON.stringify([removedItems]));
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
        } catch (err) {
            if (err.code === 'ENOENT') {
                await fs.promises.writeFile(this.deletedFile, JSON.stringify([removedItem]));
            } else {
                console.log("Error eliminando por ID. Code: ", err)
            }
        }
        return { success: `Producto con ID ${id} eliminado` }
    }

    getAllByCartId(index){
        return(this.products[index].cartList)
    }

    async saveByCartId(index, product){
        this.products[index].cartList.push(product);
        
        try{
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
            return product
        } catch(err){
            console.log("Error guardando producto en carrito: ", err)
        }
        
    }

    async deleteByCartId(indexCart, id, cartId){
        const index = this.products[indexCart].cartList.findIndex(producto=>producto.id == id);
        
        if (index != -1){
            this.products[indexCart].cartList.splice(index, 1);
            try{
                await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
                return {success: `Producto de ID ${id} eliminado del carrito de ID ${cartId}` }
            } catch(err){
                console.log("Error eliminando producto de carrito: ",err)
            }
        } else{
            return {error: `Producto de ID ${id} no encontrado en el carrito de ID ${cartId}`}
        }
        try{
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products));
            return product
        } catch(err){
            console.log("Error guardando producto en carrito: ", err)
        }
        
    }

    async emptyCartById(index, id){
        this.products[index].cartList = []

        try{
            await fs.promises.writeFile(this.productsFile, JSON.stringify(this.products))
            
            return {success: `Carrito de id ${id} vaciado` }
        } catch(err){
            console.log("Error vaciando carrito, ", err)
        }
    }

    async init(items) {
        try {
            this.products = JSON.parse(await fs.promises.readFile(this.productsFile, "utf-8"));
            this.productIds = JSON.parse(await fs.promises.readFile(this.productIdsFile, "utf-8"));

            console.log(`${items} cargados`);
        } catch (err) {
            console.log(`Error cargando ${items}. Code: `, err);
        }
    }
}

module.exports = ContenedorProducts;