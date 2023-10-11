const express = require('express');
const fs = require('fs'); // Importamos fs.promises para trabajar con promesas
const { send } = require('process');

const app = express();

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
    };
    
    app.get('/', async (req, res) => {
      res.send("Ingresar '/procucts' para ver los productos ")
});

    // Ruta para obtener los datos del archivo JSON
    app.get('/products', async (req, res) => {
      const { limit } = req.query;
    
      try {
        const data = await fs.promises.readFile("productos.json", "utf-8");
        const productosArray = JSON.parse(data);
    
        if (limit) {
          const parsedLimit = parseInt(limit, 10);
          if (!isNaN(parsedLimit) && parsedLimit >= 0) {
            const limitedProducts = productosArray.slice(0, parsedLimit);
            const htmlResponse = `
            <html>
              <head>
                <title>Lista de Productos</title>
              </head>
              <body>
                <h1>Lista de Productos</h1>
                <ul>
                  ${limitedProducts.map(product => `<li>${product.title} - Precio: $${product.price} - Id: ${product.id}</li> - Codigo: ${product.code} - Stock: ${product.stock}` ).join('')}
                </ul>
              </body>
            </html>
          `;
            return res.send(htmlResponse);
          }
        }
        const htmlResponse = `
        <html>
          <head>
            <title>Lista de Productos</title>
          </head>
          <body>
            <h1>Lista de Productos</h1>
            <ul>
              ${productosArray.map(product => `<li>${product.title} - Precio: $${product.price} - Id: ${product.id}</li> - Codigo: ${product.code} - Stock: ${product.stock}` ).join('')}
            </ul>
          </body>
        </html>
      `;
        return res.send(htmlResponse);
      } catch (error) {
        console.error('Error al leer el archivo JSON:', error);
        return res.status(500).json({ error: 'Error al leer el archivo JSON' });
      }
    });

  // Ruta con parametros de id para encontrar el producto
  app.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
      const data = await fs.promises.readFile("productos.json", "utf-8");
      const productosArray = JSON.parse(data);
      // Busca el producto por ID
      const product = productosArray.find((product) => product.id === parseInt(productId));
      
      if (product) {
        // Si se encontró el producto, devuelve solo ese producto
        const htmlResponse = `
        <html>
          <head>
            <title>Detalles del Producto</title>
          </head>
          <body>
            <h1>Detalles del Producto</h1>
            <ul>
              <li>Nombre: ${product.title}</li>
              <li>Precio: $${product.price}</li>
              <li>ID: ${product.id}</li>
              <li>Código: ${product.code}</li>
              <li>Stock: ${product.stock}</li>
            </ul>
          </body>
        </html>
      `;
        return res.send(htmlResponse);
      } else {
        // Si no se encontró el producto, devuelve un mensaje de error
        const htmlResponseError = `
        <html>
          <head>
            <title>Detalles del Producto</title>
          </head>
          <body>
            <h1 style="color: red;">ERROR</h1>
            <p>Producto NO encontrado. Solicite un ID correcto</p>
          </body>
        </html>
      `;
        return res.send(htmlResponseError);
      }
    } catch (error) {
      console.error('Error al leer el archivo JSON:', error);
      return res.status(500).send({ error: 'Producto no encontrado' });
    }
  });
  


  
// Crear una función asincrónica para iniciar el servidor después de crear el archivo JSON
async function startServer() {
  try {
    const manager = new ProductManager();
    await manager.addProduct("Taladro BD", "Taladro de 13mm", 45000, "Sin imagen", "BD13MM", 25);
    await manager.addProduct("Amoladora Skill", "Amoladora 4 1/2'' ", 38500, "Sin imagen", "AS4", 13);
    await manager.addProduct("Engrampadora Neumatica", "Engrampadora Duca 11L", 16980, "Sin imagen", "ED11", 10);
    await manager.addProduct("Engletadora Makita", "Engletadora Makita 9'' ", 109860, "Sin imagen", "EM18PR", 4);
    await manager.addProduct("Taladro BD", "Taladro de 16mm", 48000, "Sin imagen", "BD16MM", 20);
    await manager.addProduct("Amoladora BD", "Amoladora 7'' ", 50800, "Sin imagen", "ABD7", 10);
    await manager.addProduct("Sopladora CG", "Sopladora Electrica 800W", 70890, "Sin imagen", "SE800", 14);
    await manager.addProduct("Rotomartillo SPL", "Rotomartillo 750N impacto' ", 256000, "Sin imagen", "RMSPL", 3);
    await manager.addProduct("Rotomartillo Makita", "Rotomartillo 600N impacto", 200000, "Sin imagen", "RMMK", 2);
    await manager.addProduct("Compresor Daewoo", "Compresor Neumatico 500W'' ", 63750, "Sin imagen", "CD500", 6);

    // Iniciar el servidor después de crear el archivo JSON
    app.listen(8080, () => {
      console.log('Server listening on 8080 🚀. ');
    });
  } catch (error) {
    console.error('Error al crear el archivo JSON:', error);
  }
}
// Llama a la función startServer para iniciar el servidor después de crear el archivo JSON
startServer();

// usar por consola (nodemon --ignore productos.json app.js) antes de  ejecutar nodemon app.js