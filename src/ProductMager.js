const fs = require('fs');

class ProductManager {
      constructor(path){
            this.path = path;
            this.products = [];
            this.productIdCounter = 0;
      }
      async addProduct(title, description, price, thumbnail, code, stock) {
            //Valido todos los campos que son obilgatorios
            if (!title || !description || !price || !thumbnail || !code || !stock) {
              console.log("Todos los campos son obligatorios");
              return;
            }
            //Validó que no se repita el codigo
            if (this.products.some((product) => product.code === code)) {
              console.log(
                `El codigo "${code}" ya existe para otro codigo, por favor vuelva a internarlo.`
              );
              return;
            }
            //Construyo el producto
            const product = {
              id: this.productIdCounter++,
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
            };
            //Pusheo el producto al array vacio
            this.products.push(product);
            await this.saveProductsToJson();
          }
          async saveProductsToJson(){
            try {
                  await fs.promises.writeFile("productos.json", JSON.stringify(this.products, null, 2));
            } catch (error) {
                  console.error('Error al guardar los productos en el archivo JSON:', error);
            }
          }
         async getProducts(){
            try {
                  const data = await fs.promises.readFile("productos.json", "utf-8");
                  const productosArray = JSON.parse(data);
                  console.log("Productos leídos del archivo JSON:");
                  console.log(JSON.stringify(productosArray, null, 2));
            } catch (error) {
                  console.error('Error al leer los productos del archivo JSON:', error);
                  return [];
            }
          }
          async getProductById(id) {
            try {
                  const data = await fs.promises.readFile("productos.json", "utf-8");
                  const productosArray = JSON.parse(data);
                  const product = productosArray.find((product) => product.id === id);

                  if (product) {
                        console.log(`Producto encontrado por ID: ${product.id}`);
                        console.log(JSON.stringify(product, null, 2));
                        return product;
                  }else{
                        console.log(`Producto con ID ${id} no encontrado.`);
                        return null;
                  }
            } 
            catch (error) {
                  console.error('Error al leer los productos del archivo JSON:', error);
                  return null;
            }
      }
      async updateProduct(id, updatedProduct) {
            try {
              const data = await fs.promises.readFile("productos.json", "utf-8");
              const productosArray = JSON.parse(data);
              
              
              const productIndex = productosArray.findIndex((product) => product.id === id);
              if (productIndex !== -1) {

                productosArray[productIndex] = { ...productosArray[productIndex], ...updatedProduct };
                await fs.promises.writeFile("productos.json", JSON.stringify(productosArray, null, 2));
          
                console.log(`Producto con ID ${id} actualizado con éxito.`);
                console.log(JSON.stringify(productosArray[productIndex], null, 2));
                return productosArray[productIndex];
              } else {
                console.log(`Producto con ID ${id} no encontrado.`);
                return null;
              }
            } catch (error) {
              console.error('Error al actualizar el producto en el archivo JSON:', error);
              return null;
            }
          }
          async deleteProduct(id) {
            try {
              const data = await fs.promises.readFile("productos.json", "utf-8");
              const productosArray = JSON.parse(data);
          
              const productIndex = productosArray.findIndex((product) => product.id === id);
          
              if (productIndex !== -1) {

                productosArray.splice(productIndex, 1);
          
                await fs.promises.writeFile("productos.json", JSON.stringify(productosArray, null, 2));
          
                console.log(`Producto con ID ${id} eliminado con éxito.`);
                console.log(`Productos que quedan: `);
                console.log(JSON.stringify(productosArray, null, 2));
                return true;
              } else {
                console.log(`Producto con ID ${id} no encontrado.`);
                return false;
              }
            } catch (error) {
              console.error('Error al eliminar el producto en el archivo JSON:', error);
              return false;
            }
          }
          
}


const manager = new ProductManager();

// Creo los produtos y los agrego en forma de array en un arhivo json "productos.json"
(function(run) {
  if (!run) return;
      manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
      manager.addProduct("producto prueba", "Este es un producto prueba", 204, "Sin imagen", "abc124", 25);
      manager.addProduct("producto prueba", "Este es un producto prueba", 208, "Sin imagen", "abc125", 25);
      manager.addProduct("producto prueba", "Este es un producto prueba", 209, "Sin imagen", "abc126", 25);
})(true);

// Leo el archivo creado anteriormente y los devuelvo en forma de array
(function(run) {
  if (!run) return;
      manager.getProducts()
})(false);

// Recibo un id y tras leer el archivo busca el producto que coincida con el id y lo traigo en forma de array
(function(run) {
  if (!run) return;
      const productId = 1
       manager.getProductById(productId)
})(false);

// Recibo un ID tras leer el archivo busca el producto que coincida con el id y puedo actualizar sus campos
(function(run) {
  if (!run) return;
  const productId = 1;
  const updatedProduct = {
    title: "Nuevo título",
    description: "Nueva descripción",
    price: 800,
    thumbnail: "Nueva imagen",
    code: "nuevoCodigo",
    stock: 50
  };
  manager.updateProduct(productId, updatedProduct);

})(false);

// Recibo un ID tras leer el archivo busca el producto que coincida con el id y puedo eliminar el objeto, dejando el resto sin ningun problema
(function(run) {
  if (!run) return;
  const productId = 1;
  manager.deleteProduct(productId);
})(false);